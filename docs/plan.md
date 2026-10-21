# ReservaClub — Plan

Diseño a partir de `docs/spec.md` y `docs/glosario.md`. No agrega comportamiento.

## 1. Arquitectura

El backend es Node.js + TypeScript con Express, en tres capas. El frontend React + TypeScript solo llama a la API. Si oculta el botón de cancelar (RN-21), igual el backend rechaza la operación.

**Controller.** Recibe el pedido HTTP, valida que vengan los datos de la operación y llama a un service. Devuelve el resultado o el rechazo. No calcula precio, cupo, solapamiento ni deuda.

**Service.** Ahí viven las reglas de negocio. Decide si la operación se puede hacer, en qué orden, y cuándo avisar por el componente Correo. Usa el componente Reloj para "ahora". Una operación que toca varias entidades corre en una sola transacción.

**Repository.** Lee y guarda. No decide reglas. Las restricciones de negocio que se apoyan en la base son una sola reserva confirmada por cancha, día y hora de inicio (RN-35) y una sola fila por usuario en cada lista de espera (RN-55).

Services: `CanchaService`, `UsuarioService`, `PrecioService`, `ReservaService`, `ListaDeEsperaService`, `DeudaService`, `MantenimientoService`, `ResumenService`.

Componentes, no services: `Reloj` y `Correo`.

## 2. Base de datos

PostgreSQL.

Dos confirmaciones a la vez de la misma cancha se serializan con una transacción y un bloqueo de esa cancha, y una restricción única deja una sola reserva confirmada (RN-35).

Usuario, cancha, reserva, deuda y lista de espera se relacionan con integridad referencial, y el cupo, el solapamiento y el resumen se filtran por día y estado.

## 3. Modelo de datos

Los nombres son los del glosario. Un turno no es una tabla: es la clave cancha + día + hora de inicio. La hora de fin se calcula (RN-02, RN-04). Horario pico, precio final, cancelación, liberación por cancelación y liberación de rebote tampoco son tablas.

### Cancha

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | Distingue las canchas del mismo deporte. La spec no les pone nombre. |
| deporte | fútbol 5, pádel o tenis | RN-01. Datos iniciales: 2, 3 y 1. |

### Usuario

Socio y no socio son la misma entidad. No hay tabla aparte.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | |
| nombre | texto | RN-50 |
| email | texto | RN-50, RN-62. Único. Con la contraseña se entra al sistema (RN-52). |
| telefono | texto | RN-50 |
| contrasena | hash | RN-50, RN-52. Se guarda el hash, nunca el texto. No se devuelve en las respuestas. |
| condicionSocio | socio o no socio | La marca el administrador (RN-07). Al registrarse queda no socio. |
| rolAdministrador | administrador o no administrador | RN-53, RN-54. El registro lo deja en no administrador. Un administrador inicial se crea con el sistema. |
| bloqueadoHasta | instante, nulo | RN-26. Quince días desde la ausencia que lo bloquea. |
| desbloqueadoEn | instante, nulo | RN-39, RN-43. Si tiene valor, ese bloqueo no rige. Vuelve a nulo cuando hay un bloqueo nuevo. |

Restricción única: un solo usuario por email (RN-62).

### Sesión

| Campo | Tipo | Notas |
| --- | --- | --- |
| token | texto | Lo entrega `POST /entrada` (RN-52). |
| usuarioId | referencia a Usuario | Quien entró. |
| creadaEn | instante | Cuándo se creó. |

### Precio base

| Campo | Tipo | Notas |
| --- | --- | --- |
| deporte | fútbol 5, pádel o tenis | Uno vigente por deporte (RN-15). |
| monto | entero | Lo carga el administrador. |

### Feriado

| Campo | Tipo | Notas |
| --- | --- | --- |
| dia | fecha | La carga el administrador (RN-16). Se compara con el día del turno. |

### Reserva

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | |
| usuarioId | referencia a Usuario | Quien reserva (RN-18). |
| canchaId | referencia a Cancha | |
| dia | fecha | Día del turno, en la zona del club (RN-10). |
| horaInicio | hora | En punto o y media (RN-03). |
| horaFin | fecha y hora | Calculada. 60 o 90 minutos (RN-02). Si termina a las 00:00, el fin es esa hora del día siguiente, no una hora anterior al inicio (RN-04). |
| precioFinal | entero | Fijado al confirmar (RN-17) y redondeado al peso entero más cercano. El medio peso va hacia arriba (RN-58). No se recalcula. |
| condicionSocioAlReservar | socio o no socio | La de ese momento (RN-14). |
| estado | confirmada, cancelada, rechazada o ausencia | No hay estado aparte para jugada. Jugada es una confirmada cuyo turno terminó y no tiene ausencia marcada (RN-60). |
| instanteConfirmacion | instante | |
| instanteEmailAsignacion | instante, nulo | Solo si nació por asignación automática. La hora para rechazar corre desde que el sistema envía el email (RN-33). |
| instanteCancelacion | instante, nulo | |
| instanteRechazo | instante, nulo | |
| instanteAusencia | instante, nulo | Cuenta para los 30 días (RN-26). |
| canceladaPorMantenimiento | booleano | Esas no generan deuda (RN-36). |

Cupo (RN-47): reservas de esa semana, por el día del turno, en estado confirmada o ausencia. Cancelada y rechazada no cuentan.

Ocupa la cancha: solo estado confirmada. Ausencia, cancelada y rechazada no (RN-24).

Restricción única: una sola reserva confirmada para la misma cancha, día y hora de inicio.

### Deuda

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | |
| reservaId | referencia a Reserva | Una deuda por reserva que la genera. |
| usuarioId | referencia a Usuario | Cualquiera impaga bloquea (RN-13, RN-42). |
| monto | entero | 50% del precio final, redondeado al peso entero más cercano; el medio peso va hacia arriba (RN-20, RN-58). O el precio final completo (RN-24). |
| estado | impaga, pagada o anulada | No vence (RN-42). Se paga en el club (RN-22). |
| instanteMarcadaPaga | instante, nulo | Día en que el administrador la marcó pagada (RN-51). Nulo si no está pagada. |
| origen | cancelación o ausencia | El rechazo dentro de la hora no crea deuda (RN-33). |

### Lista de espera

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | |
| usuarioId | referencia a Usuario | Tiene que estar registrado (RN-45). |
| canchaId | referencia a Cancha | Turno exacto (RN-27). |
| dia | fecha | |
| horaInicio | hora | No se mueve a otro inicio (RN-46). |
| instanteLlegada | instante | Orden de llegada (RN-49). |

Restricción única: una fila por usuario en cada turno, esto es cancha, día y hora de inicio (RN-55).

Se borra la fila cuando esa persona reserva desde un rebote (RN-31), cuando el turno empieza (RN-34) o cuando el mantenimiento pisa ese turno (RN-37). Toda consulta ignora las listas de espera de turnos que ya empezaron.

### Mantenimiento

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | identificador | |
| canchaId | referencia a Cancha | |
| inicio | instante | |
| fin | instante | En ese período la cancha no se reserva (RN-36). |

### Relaciones

- Una cancha tiene muchas reservas, listas de espera y mantenimientos.
- Un usuario tiene muchas reservas, filas de lista de espera, deudas y sesiones.
- Una reserva tiene como mucho una deuda.
- El precio base y el feriado no cuelgan de la reserva: el precio final ya guardado no se toca (RN-15, RN-19).

## 4. API

No hay rutas para cobrar online, mover una reserva o una lista a otro inicio, ni reservar o cancelar un turno ya empezado. Para entrar se usa email y contraseña (RN-52). La columna "Quién" es el rol de la historia.

`POST /entrada` crea una Sesión con el token, el usuario y el instante de creación. Los pedidos siguientes mandan el token. El Controller busca esa Sesión y ese usuario es quien llama. Si la ruta es de administrador y el usuario no tiene el rol, el Controller la rechaza.

HU-07 no tiene ruta propia: el aviso lo manda Correo y quien llega primero usa `POST /reservas`.

| Método | Ruta | Qué hace | Quién | HU |
| --- | --- | --- | --- | --- |
| POST | /usuarios | Registra con nombre, email, teléfono y contraseña. Queda no socio y sin rol de administrador. Si el email ya existe, rechaza (RN-62). | Usuario no registrado | HU-13, HU-01 |
| POST | /entrada | Entra con email y contraseña. Si no coinciden, no entra. Si coinciden, crea la Sesión y entrega el token. | Usuario registrado | HU-15 |
| GET | /usuarios | Lista usuarios para marcar socio o desbloquear. | Administrador | HU-01, HU-12 |
| PATCH | /usuarios/:usuarioId/condicion-socio | Marca socio o no socio. No cambia reservas ya hechas. | Administrador | HU-01, HU-12 |
| POST | /usuarios/:usuarioId/rol-administrador | Da el rol de administrador. Si quien llama no es administrador, no lo permite. | Administrador | HU-16 |
| POST | /usuarios/:usuarioId/desbloqueo | Levanta el bloqueo. Las ausencias siguen. | Administrador | RN-39. No hay HU propia; el efecto está en HU-08. |
| GET | /canchas | Devuelve las 6 canchas. | Usuario | HU-02 |
| GET | /canchas/:canchaId/turnos?dia= | Turnos que todavía se ofrecen ese día. Consulta los mantenimientos y no ofrece lo que se pisa con uno. | Usuario | HU-02, HU-03 |
| POST | /reservas | Confirma una reserva si cumple anticipación, cupo, deuda, bloqueo, horario y solapamiento. Consulta los mantenimientos y no confirma si el turno se pisa con uno. | Usuario | HU-02, HU-03, HU-07, HU-11 |
| GET | /reservas | Reservas de esa persona, para poder cancelar. | Usuario | HU-04 |
| GET | /reservas?dia= | Reservas de ese día. | Administrador | HU-08 |
| POST | /reservas/:reservaId/cancelacion | Cancela antes del inicio. Devuelve cupo y, si falta menos de 24 horas, crea la deuda del 50%. | Usuario | HU-04 |
| POST | /reservas/:reservaId/rechazo | Rechaza una asignación automática dentro de la hora desde que el sistema envió el email. | Usuario | HU-06 |
| POST | /reservas/:reservaId/ausencia | Marca la ausencia después de los 15 minutos, libera la cancha y crea la deuda completa. | Administrador | HU-08 |
| POST | /listas-de-espera | Anota en el turno exacto solo si está ocupado: no se puede reservar porque se pisa con una reserva confirmada, aunque el inicio sea otro. No gasta cupo. Si esa persona ya está en esa lista, no crea otra fila. | Usuario | HU-05 |
| POST | /mantenimientos | Cierra la cancha entre inicio y fin. Cancela sin cargo lo que se pisa y borra esas listas. | Administrador | HU-09 |
| GET | /deudas?usuarioId= | Deudas de una persona, para marcarlas. | Administrador | HU-10 |
| POST | /deudas/:deudaId/pago | Marca la deuda pagada. | Administrador | HU-10 |
| POST | /deudas/:deudaId/anulacion | Anula la deuda. | Administrador | HU-10 |
| PUT | /precios-base/:deporte | Carga o cambia el precio base de ese deporte. | Administrador | HU-12 |
| POST | /feriados | Carga un feriado. | Administrador | HU-12 |
| GET | /resumen?dia=&deporte= | Cantidad de reservas e ingresos de ese día y deporte. Se calcula al consultarlo: si después se marca una ausencia, cambia. | Administrador | HU-14 |

## 5. Dónde vive cada regla

| RN | Dónde |
| --- | --- |
| RN-01 | CanchaService. Datos iniciales: 2 de fútbol 5, 3 de pádel, 1 de tenis. |
| RN-02 | ReservaService. Calcula la hora de fin según el deporte. |
| RN-03 | ReservaService. Solo inicios en punto o y media, de 8:00 a 00:00. |
| RN-04 | ReservaService. Rechaza un fin posterior a las 00:00. Último inicio: 23:00 o 22:30. |
| RN-05 | ReservaService. Rechaza un turno que se pisa con una reserva que todavía ocupa la cancha. |
| RN-06 | ReservaService, con Reloj. Se ofrece hasta el minuto de inicio; después no. |
| RN-07 | UsuarioService guarda la condición de socio. ReservaService no confirma si no hay usuario. |
| RN-08 | ReservaService. Anticipación y tope de 2 reservas activas del socio. |
| RN-09 | ReservaService. Anticipación y tope de 1 del no socio. |
| RN-10 | ReservaService. Semana lunes a domingo, por el día del turno. |
| RN-11 | ReservaService. Al cancelar, esa reserva sale del cupo. |
| RN-12 | ListaDeEsperaService no crea reserva al anotar. ReservaService gasta el cupo al asignar y lo devuelve al rechazar dentro de la hora. |
| RN-13 | ReservaService y ListaDeEsperaService consultan DeudaService. Con una impaga, no reservan ni anotan. |
| RN-14 | ReservaService copia precio final y condición de socio al confirmar. |
| RN-15 | PrecioService guarda el precio base vigente. No reescribe reservas. |
| RN-16 | PrecioService. Horario pico de 18:00 a 22:59, salvo sábado, domingo y feriado. |
| RN-17 | PrecioService. Precio base × 1,30 si es pico, después × 0,80 si es socio. El resultado se redondea al peso entero más cercano; el medio peso va hacia arriba (RN-58). |
| RN-18 | PrecioService usa la condición de quien reserva, no la de quien juega con esa persona. |
| RN-19 | PrecioService solo calcula al confirmar. Un feriado posterior no cambia el precio final. |
| RN-20 | ReservaService. Con 24 horas o más, sin deuda. Con menos, DeudaService crea el 50%, redondeado al peso entero más cercano; el medio peso va hacia arriba (RN-58), aunque se reasigne. |
| RN-21 | ReservaService rechaza la cancelación desde el inicio. El frontend solo esconde el botón. |
| RN-22 | DeudaService. No hay cobro online. El administrador marca pagada o anula. |
| RN-23 | ReservaService. A los 15 minutos todavía puede jugar. A los 16, si el administrador marca, es ausencia. |
| RN-24 | ReservaService, después de los 15 minutos. Deja de ocupar la cancha y DeudaService crea la deuda por el precio final. |
| RN-25 | ReservaService. Los inicios que todavía no empezaron y que esa reserva pisaba quedan libres como rebote. |
| RN-26 | UsuarioService, cuando ReservaService marca la ausencia. Cuenta las de los 30 días anteriores, incluida esta: la tercera bloquea 15 días desde ese instante. |
| RN-27 | ListaDeEsperaService. La fila es de un turno exacto y usa la misma anticipación que reservar. Solo anota si el turno está ocupado (RN-59). |
| RN-28 | ReservaService. Con 1 hora o más, asigna al primero de esa lista que no esté bloqueado, no deba y tenga cupo. |
| RN-29 | ReservaService. Si nadie puede, el turno queda libre. Otras listas no lo reciben solas. |
| RN-30 | ReservaService y Correo. Con menos de 1 hora no asigna: avisa a toda la lista con el email de turno liberado de rebote. |
| RN-31 | ReservaService y Correo. El rebote avisa a toda la lista, no asigna, y quien reserva sale de la lista. |
| RN-32 | ReservaService. Elige asignación o aviso según la causa, sin contar cuántas veces se liberó. |
| RN-33 | ReservaService. Dentro de la hora desde que el sistema envía el email, el rechazo no genera deuda y libera ese inicio como cancelación. Después, la reserva queda firme. |
| RN-34 | ListaDeEsperaService, con Reloj. Toda consulta ignora las listas de espera de turnos que ya empezaron. |
| RN-35 | ReservaService en una transacción, más la restricción única del repository. Ver sección 6. |
| RN-36 | MantenimientoService. En el período no se reserva. ReservaService consulta los mantenimientos al listar turnos y al reservar. Cancela sin cargo solo lo que se pisa, devuelve ese cupo y Correo avisa a cada persona. |
| RN-37 | MantenimientoService borra las listas de los turnos pisados y Correo avisa. |
| RN-38 | Correo. Cinco avisos: reserva confirmada, cancelación, turno recibido por asignación automática, bloqueo por mantenimiento y turno liberado de rebote. |
| RN-39 | UsuarioService desbloquea. ResumenService arma el resumen. |
| RN-40 | ReservaService. La ausencia sigue en el cupo aunque DeudaService la tenga pagada. |
| RN-41 | ReservaService. No agrega un veto: esa persona reserva un inicio posterior con las reglas comunes. |
| RN-42 | DeudaService. La impaga sigue bloqueando hasta pagada o anulada. |
| RN-43 | UsuarioService. Al desbloquear, las ausencias quedan y el bloqueo no se rearma solo. Solo se vuelve a evaluar al marcar otra ausencia. |
| RN-44 | ReservaService. El rechazo dentro de la hora sigue por RN-28 o RN-30 según cuánto falte para el inicio. |
| RN-45 | ListaDeEsperaService. Sin usuario registrado, no anota. |
| RN-46 | ReservaService y ListaDeEsperaService. No existe una operación que mueva la reserva o la lista a otro inicio. |
| RN-47 | ReservaService. El cupo usa la definición de reserva activa. |
| RN-48 | ListaDeEsperaService no anota a un bloqueado. ReservaService sí le deja cancelar lo que conserva. |
| RN-49 | ListaDeEsperaService. Orden por instante de llegada. |
| RN-50 | UsuarioService. El registro pide nombre, email, teléfono y contraseña. |
| RN-51 | ResumenService. Por día y deporte: la cantidad son las jugadas (RN-60) por el día del turno. Los ingresos suman su precio y las deudas pagadas por el día en que el administrador las marcó pagadas. Se calcula al consultar (RN-61). |
| RN-52 | UsuarioService. Para entrar compara email y el hash de la contraseña. Si no coinciden, no entra. Si coinciden, crea una Sesión y entrega el token. |
| RN-53 | UsuarioService. Dato inicial: un administrador creado con el sistema. |
| RN-54 | UsuarioService. Solo un administrador puede dar el rol de administrador a otro usuario. |
| RN-55 | ListaDeEsperaService. Una persona, una fila por turno. La base lo refuerza con la restricción única. |
| RN-56 | ListaDeEsperaService. Al asignar, borra esa fila. El rechazo no la vuelve a crear. Si se anota de nuevo, la fila nueva queda última por su instante de llegada. |
| RN-57 | ReservaService, consultando PrecioService. Sin precio base, ese deporte no se ofrece. |
| RN-58 | PrecioService redondea el precio final al peso entero más cercano. DeudaService hace lo mismo con el 50% de una cancelación. El medio peso se redondea hacia arriba. |
| RN-59 | ListaDeEsperaService. Un turno está ocupado si no se puede reservar porque se pisa con una reserva confirmada, aunque no empiece a la misma hora. Solo en ese caso se anota. |
| RN-60 | ResumenService. Jugada es una confirmada cuyo turno terminó y no tiene ausencia marcada. |
| RN-61 | ResumenService. El resumen se calcula al consultarlo. Si después se marca una ausencia, el resultado cambia. |
| RN-62 | UsuarioService. El email es único; si ya existe un usuario con ese email, el registro se rechaza. La base lo refuerza con la restricción única. |

Correo, destinatarios que la spec ya nombra: reserva confirmada al titular; cancelación al titular; asignación automática a quien la recibe; mantenimiento a cada persona de las reservas canceladas y de las listas borradas; rebote (y el aviso de RN-30) a toda la lista de ese inicio.

## 6. Decisiones técnicas

**Concurrencia (RN-35).** `POST /reservas` corre en una transacción de ReservaService. La protección contra solapamientos es el bloqueo de la fila de esa cancha: la otra confirmación espera y, recién entonces, se buscan reservas confirmadas cuyo intervalo se pise con el turno pedido. Si hay alguna, no se confirma. La restricción única no cubre inicios distintos que se pisan. Solo impide dos reservas confirmadas de la misma cancha, el mismo día y la misma hora de inicio. Si las dos pidieron ese mismo inicio, la base rechaza la segunda. Esa persona ve que el turno no está disponible y puede usar `POST /listas-de-espera`. No se confirman las dos. Crear un mantenimiento, hacer una asignación automática y marcar una ausencia usan el mismo bloqueo de la cancha que `POST /reservas`.

**Hora y zona.** La zona del club es `America/Argentina/Buenos_Aires`. El día y la hora de inicio del turno se guardan como fecha y hora de esa zona, porque las reglas hablan de las 8:00, las 18:00, lunes a domingo y días de calendario. Los instantes (email, ausencia, bloqueo, pago) se guardan en UTC y se leen en esa zona. Los services no miran el reloj de la máquina directo: preguntan a Reloj. En producción, Reloj es el reloj del sistema. En los tests, el tester fija el instante y toda anticipación, cupo semanal, minuto de inicio, 15 minutos, hora para rechazar, 24 horas y fin del bloqueo usan ese valor. No hace falta un proceso aparte: toda consulta ignora las listas de espera de turnos que ya empezaron, y la reserva firme y el bloqueo vencido se juzgan al atender la operación.

**Emails en desarrollo.** Correo es un puerto. En desarrollo no se conecta a un servidor real: deja por escrito el tipo de aviso (RN-38), el destinatario y el instante. Los tests usan un doble en memoria y leen esa lista. El instante guardado en `instanteEmailAsignacion` es el momento en que el sistema envía el email de asignación automática, y desde ahí corre la hora para rechazar (RN-33).

## 7. Preguntas para el analista

Sin preguntas.
