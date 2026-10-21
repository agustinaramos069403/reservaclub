# ReservaClub — Tareas

Ordenadas por dependencia, según `docs/spec.md` y `docs/plan.md`. Cada tarea es un cambio chico y revisable. El backend de cada etapa cierra antes de la siguiente. El frontend va al final.

Estado: `[ ]` pendiente · `[x]` hecha.

---

## Etapa 1 — Base

### T-01 — Proyecto backend y framework de tests
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Crear el backend Node.js + TypeScript con Express en capas Controller, Service y Repository. Configurar un framework de tests que permita fijar el Reloj y un Correo en memoria. Sin endpoints de dominio todavía.
- **RN / HU:** (infraestructura; sin RN de dominio)
- **Depende de:** —
- **Terminada cuando:**
  1. Un test vacío corre y pasa.
  2. Un test puede inyectar Reloj y Correo sin pegarle al reloj de la máquina ni a un servidor de email real.

### T-02 — Base de datos PostgreSQL y esquema
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Crear las tablas del plan (Cancha, Usuario, Sesión, Precio base, Feriado, Reserva, Deuda, Lista de espera, Mantenimiento) con integridad referencial y las restricciones únicas de reserva confirmada, de lista de espera y de email de usuario (RN-62).
- **RN / HU:** RN-35, RN-55, RN-62
- **Depende de:** T-01
- **Terminada cuando:**
  1. Con una migración limpia, existen las tablas del plan.
  2. Insertar dos reservas confirmadas con la misma cancha, día y hora de inicio falla por la restricción única.
  3. Insertar dos filas de lista de espera del mismo usuario para la misma cancha, día y hora de inicio falla por la restricción única.
  4. Insertar dos usuarios con el mismo email falla por la restricción única (RN-62).

### T-03 — Reloj
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Implementar el componente Reloj. En producción usa el reloj del sistema; en tests el instante lo fija el tester. Los services no leen la hora de la máquina directo. Zona del club: `America/Argentina/Buenos_Aires`.
- **RN / HU:** (componente; usado por RN-06, RN-20, RN-21, RN-23, RN-26, RN-33, RN-34)
- **Depende de:** T-01
- **Terminada cuando:**
  1. Con Reloj fijado en `2026-10-21T15:00:00-03:00`, una consulta de "ahora" devuelve exactamente ese instante.
  2. Avanzar Reloj a `2026-10-21T16:00:00-03:00` hace que la siguiente consulta vea la hora nueva.

### T-04 — Correo simulado
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Implementar el puerto Correo. En desarrollo y tests deja por escrito tipo de aviso (RN-38), destinatario e instante. No conecta a un servidor real.
- **RN / HU:** RN-38
- **Depende de:** T-01, T-03
- **Terminada cuando:**
  1. Tras un envío simulado de tipo "reserva confirmada" a `socio@club.test`, la lista en memoria tiene exactamente ese tipo, ese destinatario y el instante del Reloj.
  2. Sin envíos, la lista está vacía.

### T-05 — Datos iniciales: canchas y administrador
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Al crear el sistema, cargar 2 canchas de fútbol 5, 3 de pádel y 1 de tenis, y un administrador inicial con email conocido. La contraseña del administrador inicial se lee de una variable de entorno.
- **RN / HU:** RN-01, RN-53 · HU-16
- **Depende de:** T-02
- **Terminada cuando:**
  1. Tras el arranque, una consulta al repositorio de canchas muestra 6 canchas: 2 fútbol 5, 3 pádel, 1 tenis.
  2. Una consulta al repositorio de usuarios muestra un usuario con `rolAdministrador`; con la variable de entorno de contraseña inicial en `AdminSecreta1`, el hash guardado coincide con ese valor (RN-53). Sin usar `POST /entrada`.

### T-06 — Registro de usuario
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /usuarios` con nombre, email, teléfono y contraseña. Queda no socio y sin rol de administrador. Guarda hash de contraseña, nunca el texto.
- **RN / HU:** RN-50 · HU-13, HU-01
- **Depende de:** T-02
- **Terminada cuando:**
  1. Con `{ nombre: "Ana", email: "ana@test.com", telefono: "111", contrasena: "secreta" }`, el sistema crea el usuario no socio y no administrador.
  2. La respuesta no incluye la contraseña ni el hash.

### T-07 — Email único en el registro
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** El email de un usuario es único (RN-62). Un segundo `POST /usuarios` con un email ya registrado no crea otro usuario.
- **RN / HU:** RN-62 · HU-13
- **Depende de:** T-06, T-02
- **Terminada cuando:**
  1. Con Ana ya registrada como `ana@test.com`, un segundo registro con el mismo email responde `409` y cuerpo `{ "mensaje": "El email ya está registrado" }`; no se crea otro usuario.
  2. Un registro con email distinto `bruno@test.com` sí crea el usuario.

### T-08 — Entrada y sesión
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /entrada` con email y contraseña. Si coinciden, crea Sesión y entrega token. Los pedidos siguientes envían el token; el Controller resuelve el usuario.
- **RN / HU:** RN-52 · HU-15
- **Depende de:** T-06
- **Terminada cuando:**
  1. Ana registrada con `secreta` entra con esos datos y recibe un token; un pedido autenticado reconoce a Ana.
  2. Con contraseña `otra`, el sistema no deja entrar y no crea sesión.

### T-09 — Condición de socio y listado de usuarios
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /usuarios` y `PATCH /usuarios/:usuarioId/condicion-socio` solo para administrador. Marcar socio o no socio no reescribe reservas ya hechas (eso se verifica cuando existan reservas).
- **RN / HU:** RN-07, RN-14 · HU-01, HU-12
- **Depende de:** T-05, T-08
- **Terminada cuando:**
  1. El administrador marca a Ana como socio; Ana queda con `condicionSocio = socio`.
  2. Un no administrador que llama al PATCH recibe rechazo.
  3. `GET /usuarios` lista a Ana con su condición actual.

### T-10 — Dar rol de administrador
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /usuarios/:usuarioId/rol-administrador`. Solo un administrador puede dar el rol.
- **RN / HU:** RN-54 · HU-16
- **Depende de:** T-05, T-08
- **Terminada cuando:**
  1. El administrador inicial da el rol a Ana; Ana queda administrador.
  2. Un usuario sin rol de administrador intenta dar el rol y el sistema no lo permite.

---

## Etapa 2 — Precio y horarios

### T-11 — Precio base por deporte
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `PUT /precios-base/:deporte` para cargar o cambiar el monto. PrecioService guarda el vigente; no reescribe reservas (verificación plena en etapa de reserva).
- **RN / HU:** RN-15 · HU-12
- **Depende de:** T-08, T-10
- **Terminada cuando:**
  1. El administrador carga pádel con monto `10000`; el precio base vigente de pádel es `10000`.

### T-12 — Feriados
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /feriados` carga un día. Queda disponible para que PrecioService lo use al calcular horario pico.
- **RN / HU:** RN-16 · HU-12
- **Depende de:** T-08, T-10
- **Terminada cuando:**
  1. El administrador carga el feriado `2026-11-06`.
  2. Una consulta de feriados (repositorio o listado del service) incluye exactamente ese día.

### T-13 — Cálculo de precio final
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** PrecioService recibe precio base, feriados y condición de socio como datos (sin depender de los endpoints de carga). Calcula: base × 1,30 si pico (18:00–22:59, salvo sáb/dom/feriado), después × 0,80 si socio. Redondeo al peso entero más cercano; medio peso hacia arriba. El precio es el de quien reserva.
- **RN / HU:** RN-16, RN-17, RN-18, RN-58 · HU-12, HU-03
- **Depende de:** T-01, T-03
- **Terminada cuando:**
  1. Pádel miércoles 20:00, base `10000`, socio → `10400`.
  2. Mismo turno, no socio → `13000`.
  3. Pádel miércoles 10:00, base `10000`, socio → `8000`.
  4. Pádel sábado 20:00, base `10000`, socio → `8000`.
  5. Pádel miércoles 17:30, base `10000`, no socio → `10000`.
  6. Pádel miércoles 22:30, base `10000`, no socio → `13000`.
  7. Base `9999`, pico, socio → `10399` (RN-58).
  8. Base `10005`, pico, no socio → `13007` (RN-58).
  9. Socio reserva pádel miércoles 20:00 base `10000` aunque juegue con no socios → precio final `10400` (RN-18).
  10. Pádel miércoles feriado 20:00, base `10000`, no socio → `10000` (RN-16).

### T-14 — Listado de canchas
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /canchas` devuelve las 6 canchas con su deporte.
- **RN / HU:** RN-01 · HU-02
- **Depende de:** T-05, T-08
- **Terminada cuando:**
  1. Un usuario autenticado obtiene 6 canchas: 2 fútbol 5, 3 pádel, 1 tenis.

### T-15 — Turnos ofrecidos de un día (sin reservas)
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /canchas/:canchaId/turnos?dia=` lista inicios en punto o y media, apertura 8:00–00:00, duración 60/90, último inicio 23:00 (fútbol 5) o 22:30 (pádel/tenis). No ofrece deporte sin precio base. Usa Reloj: no ofrece un inicio ya pasado.
- **RN / HU:** RN-02, RN-03, RN-04, RN-06, RN-57 · HU-02, HU-03
- **Depende de:** T-03, T-11, T-14
- **Terminada cuando:**
  1. Pádel el día D: último inicio ofrecido `22:30`; no aparece `23:00`.
  2. Fútbol 5: último inicio `23:00`.
  3. Reloj en `18:00` del día D: el turno de `17:30` ya no se ofrece; el de `18:00` sí.
  4. Reloj un minuto después de `18:00`: el de `18:00` ya no se ofrece.
  5. Tenis sin precio base: no se ofrece ningún turno de esa cancha (RN-57).

---

## Etapa 3 — Reservar

### T-16 — Confirmar reserva y fijar precio
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /reservas` confirma si hay usuario, precio base, horario válido y cancha libre. Guarda `precioFinal` y `condicionSocioAlReservar`. Envía email de reserva confirmada.
- **RN / HU:** RN-07, RN-14, RN-15, RN-17, RN-18, RN-19, RN-38 · HU-02, HU-12
- **Depende de:** T-13, T-15, T-04, T-09
- **Terminada cuando:**
  1. Socio Ana reserva pádel miércoles 20:00, base `10000` → confirmada con precio `10400` y condición socio; Correo tiene "reserva confirmada" para Ana.
  2. Después se cambia el precio base a `20000` o se carga feriado ese día → la reserva sigue en `10400`.
  3. Se le quita socio a Ana → esa reserva conserva condición socio y `10400`.
  4. Usuario no autenticado → no se crea la reserva.

### T-17 — Listado de reservas del usuario
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /reservas` devuelve las reservas de la persona autenticada.
- **RN / HU:** HU-04
- **Depende de:** T-16
- **Terminada cuando:**
  1. Ana con una reserva confirmada de pádel miércoles 20:00 llama `GET /reservas` y obtiene exactamente esa reserva (cancha, día, hora, precio `10400`, estado confirmada).
  2. Bruno sin reservas llama `GET /reservas` y obtiene lista vacía.

### T-18 — Anticipación y cupo semanal
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Socio: hasta el mismo día de la semana siguiente, tope 2 activas. No socio: hasta 3 días después de hoy, tope 1. Semana lunes–domingo por día del turno. Reserva activa = confirmada o ausencia de esa semana (jugadas cuentan).
- **RN / HU:** RN-08, RN-09, RN-10, RN-47 · HU-02, HU-03
- **Depende de:** T-16
- **Terminada cuando:**
  1. Hoy miércoles 21/10/2026: socio puede reservar hasta miércoles 28/10; el jueves 29 no.
  2. No socio: turno a 4 días → rechazo; a 3 días o menos con cupo → ok.
  3. Socio con 2 confirmadas en la misma semana (lun–dom del turno) → tercera rechazada.
  4. No socio con 1 activa esa semana → segunda rechazada.
  5. Socio que ya jugó un turno de esa semana (turno terminado, sin ausencia): esa reserva sigue en el cupo (RN-47).

### T-19 — Superposición de turnos
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Un turno ocupa todo el intervalo. Rechazar cualquier otro que se pise, aunque el inicio sea otro. Actualizar el listado de turnos ofrecidos.
- **RN / HU:** RN-05 · HU-02
- **Depende de:** T-16
- **Terminada cuando:**
  1. Pádel confirmado 18:00–19:30: no se puede reservar esa cancha a las 17:00, 17:30, 18:30 ni 19:00.
  2. El siguiente inicio libre de esa cancha es 19:30.
  3. Otra cancha del mismo deporte a las 18:00 sí se puede reservar.

### T-20 — Concurrencia al confirmar el mismo turno
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /reservas` en transacción con bloqueo de la fila de la cancha. Dos confirmaciones simultáneas: vale la primera; la otra ve no disponible.
- **RN / HU:** RN-35 · HU-11
- **Depende de:** T-16, T-19, T-02
- **Terminada cuando:**
  1. Dos usuarios confirman a la vez la misma cancha, día y hora: una sola reserva confirmada; la otra recibe `409` con `{ "mensaje": "El turno no está disponible" }`.

---

## Etapa 4 — Cancelar y deudas

### T-21 — Cancelar reserva
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /reservas/:reservaId/cancelacion` antes del inicio. ≥24 h: sin deuda, vuelve cupo. &lt;24 h: deuda 50% del precio final (redondeo RN-58), aunque se reasigne. Desde el inicio: rechazo. Email de cancelación.
- **RN / HU:** RN-11, RN-20, RN-21, RN-38, RN-58 · HU-04, HU-12
- **Depende de:** T-16, T-18, T-04
- **Terminada cuando:**
  1. Precio final `13000`, Reloj exactamente 24 h antes del inicio → cancelación sin deuda; cupo de esa semana vuelve.
  2. Reloj a 23 h 59 min antes → deuda `6500`; cupo vuelve.
  3. Precio final `13001`, &lt;24 h → deuda `6501`.
  4. Reloj en la hora de inicio o después → cancelación rechazada.
  5. Correo registra "cancelación" al titular.

### T-22 — Marcar deuda pagada o anulada
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /deudas?usuarioId=`, `POST /deudas/:deudaId/pago`, `POST /deudas/:deudaId/anulacion`. Sin cobro online. La deuda no vence.
- **RN / HU:** RN-22, RN-42 · HU-10
- **Depende de:** T-21
- **Terminada cuando:**
  1. Tras cancelar &lt;24 h, hay deuda impaga; el administrador la marca pagada → estado pagada e `instanteMarcadaPaga` del Reloj.
  2. Otra deuda se anula → estado anulada.
  3. Con deuda impaga, pasan días (Reloj) y el usuario sigue sin poder reservar (RN-42); al marcar pagada o anulada todas, vuelve a poder si cumple cupo y anticipación.

### T-23 — Deuda impaga bloquea reserva
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Con cualquier deuda impaga real (de cancelación u otra), `POST /reservas` no confirma (RN-13). El bloqueo al anotar en lista se cierra en T-24.
- **RN / HU:** RN-13 · HU-10
- **Depende de:** T-16, T-22
- **Terminada cuando:**
  1. Usuario con deuda impaga por cancelación intenta `POST /reservas` → rechazo.
  2. Administrador marca esa deuda pagada → el mismo usuario puede reservar si cumple cupo y anticipación.

---

## Etapa 5 — Lista de espera

### T-24 — Condiciones para anotarse en lista de espera
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /listas-de-espera` solo si el turno está ocupado (se pisa con una confirmada, aunque el inicio sea otro). Misma anticipación que reservar. No gasta cupo. Requiere registro; sin deuda impaga.
- **RN / HU:** RN-12, RN-13, RN-27, RN-45, RN-59 · HU-05
- **Depende de:** T-18, T-19, T-23
- **Terminada cuando:**
  1. Pádel confirmado 18:00–19:30: anotarse a las 18:30 de esa cancha → ok (ocupado por solape); no gasta cupo.
  2. Inicio que no se pisa con ninguna confirmada → no anota.
  3. Sin autenticación → no anota.
  4. Con deuda impaga → no anota.
  5. No socio intenta anotarse en un turno a 4 días → no anota (RN-27).

### T-25 — Orden y unicidad en lista de espera
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Una fila por usuario y turno. Orden por llegada.
- **RN / HU:** RN-49, RN-55 · HU-05
- **Depende de:** T-24, T-02
- **Terminada cuando:**
  1. Misma persona dos veces en ese turno → no crea segunda fila.
  2. Ana anota a las 10:00, Bruno a las 10:01 → Ana queda primero (RN-49).

### T-26 — Asignación automática al cancelar (≥ 1 h)
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Liberación por cancelación de ese inicio exacto con ≥1 h: asignar al primero de esa lista sin bloqueo, sin deuda y con cupo. Gasta cupo. Sale de la lista. Email de asignación. Si nadie puede, queda libre; otras listas no lo reciben solas. Usa el bloqueo de la fila de la cancha (plan §6).
- **RN / HU:** RN-12, RN-28, RN-29, RN-38, RN-46, RN-56 · HU-05, HU-06
- **Depende de:** T-21, T-24, T-25, T-04
- **Terminada cuando:**
  1. Cancelan las 18:00 con ≥1 h; Ana (primera, apta) recibe reserva confirmada, sale de la lista, cupo gastado; Correo "turno recibido por asignación automática".
  2. Lista de las 18:30 no recibe sola esa liberación (RN-29, RN-46).
  3. Nadie de la lista puede (todos con deuda o sin cupo) → turno libre para reserva normal.
  4. Mientras corre una asignación automática sobre una cancha, un `POST /reservas` concurrente de otro usuario a un turno que se pisa espera el bloqueo y, al terminar, ve el turno no disponible (`409`, `{ "mensaje": "El turno no está disponible" }`).

### T-27 — Aviso sin asignación (&lt; 1 h o rebote)
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Si falta &lt;1 h al cancelar ese inicio, o es liberación de rebote: no asignar; avisar a toda la lista (email liberado de rebote). Quien reserva primero con `POST /reservas` sale de la lista; los demás siguen.
- **RN / HU:** RN-30, RN-31, RN-32, RN-38, RN-46 · HU-07
- **Depende de:** T-24, T-16, T-04, T-21
- **Terminada cuando:**
  1. Cancelan ese inicio con &lt;1 h: Correo avisa a toda la lista; nadie tiene reserva automática.
  2. Bruno reserva primero el turno liberado → confirmado y sale de la lista; Ana sigue anotada.
  3. Cancelan las 18:00 con gente en lista de 18:30: no se mueve esa lista a otro inicio (RN-46).
  4. Un turno ya liberado una vez por cancelación &lt;1 h (aviso, sin asignación) se vuelve a ocupar y se cancela de nuevo con &lt;1 h: otra vez aviso a toda la lista, sin asignación automática (RN-32).

### T-28 — Rechazar asignación automática
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /reservas/:reservaId/rechazo` dentro de 1 h desde `instanteEmailAsignacion`: sin deuda, vuelve cupo, libera como cancelación de ese inicio (RN-28 o RN-30). Pasada 1 h: rechazo no aplica; reserva firme y cancelar usa las 24 h. Rechazar no reanota solo.
- **RN / HU:** RN-12, RN-20, RN-32, RN-33, RN-44, RN-56 · HU-06
- **Depende de:** T-26, T-27
- **Terminada cuando:**
  1. Rechazo a los 30 min del email: sin deuda, cupo vuelve; si faltan ≥1 h al inicio → nueva asignación; si &lt;1 h → aviso a toda la lista.
  2. Tras rechazar, sin anotarse de nuevo → no vuelve a la lista; si se anota y ya hay otro → queda último.
  3. Pasada 1 h desde el email, la reserva está firme; cancelarla &lt;24 h genera deuda 50%.
  4. Tras una primera liberación por cancelación (≥1 h) que asignó y luego se rechazó, una segunda cancelación del mismo inicio con ≥1 h vuelve a asignar por RN-28 (no por rebote) (RN-32).

### T-29 — Borrar listas al empezar el turno
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Toda consulta ignora (o borra) listas de turnos que ya empezaron.
- **RN / HU:** RN-34 · HU-05
- **Depende de:** T-24, T-03
- **Terminada cuando:**
  1. Hay gente en la lista de un turno 18:00; Reloj pasa a 18:00 → esa lista ya no se considera; no se asigna ni se avisa por ella.

---

## Etapa 6 — Ausencias y bloqueos

### T-30 — Reservas del día para el administrador
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /reservas?dia=` lista las reservas de ese día para el administrador (HU-08).
- **RN / HU:** HU-08
- **Depende de:** T-16, T-08, T-10
- **Terminada cuando:**
  1. Hay una reserva confirmada de pádel el `2026-10-28` a las 18:00; el administrador llama `GET /reservas?dia=2026-10-28` y la obtiene.
  2. Un no administrador que llama esa ruta recibe rechazo.

### T-31 — Marcar ausencia
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /reservas/:reservaId/ausencia` solo después de 15 minutos del inicio. Deja de ocupar la cancha; deuda por precio final completo; cupo de la semana sigue ocupado aunque se pague. A los 15 min exactos todavía no es ausencia. Usa el bloqueo de la fila de la cancha (plan §6).
- **RN / HU:** RN-23, RN-24, RN-40, RN-41, RN-47 · HU-08
- **Depende de:** T-16, T-18, T-22, T-03, T-30
- **Terminada cuando:**
  1. Reloj a 10 min del inicio → marcar ausencia rechazado.
  2. Reloj a 15 min → aún no permitido; a 16 min → ok: estado ausencia, deuda = precio final, cancha libre.
  3. Pagada la deuda, el usuario intenta otra reserva la misma semana → rechazo por cupo (RN-40).
  4. Queda libre un inicio posterior; esa persona puede reservarlo con las reglas normales (RN-41).
  5. Mientras el administrador marca la ausencia, un `POST /reservas` concurrente a un inicio que esa reserva pisaba espera el bloqueo de la cancha y, al seguir, encuentra el inicio libre y lo confirma.
  6. Socio con una ausencia marcada en un turno de esa misma semana (lun–dom del turno): intenta otra reserva en esa semana → rechazo por cupo (RN-47).

### T-32 — Liberación de rebote por ausencia
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Al marcar ausencia, los inicios posteriores que esa reserva pisaba y que aún no empezaron quedan libres como rebote: aviso a sus listas, sin asignación automática.
- **RN / HU:** RN-25, RN-31, RN-06 · HU-08, HU-07
- **Depende de:** T-31, T-27
- **Terminada cuando:**
  1. Pádel 18:00–19:30, ausencia marcada a las 18:20: se liberan 18:30 y 19:00; Correo avisa a esas listas; nadie recibe asignación automática.
  2. El inicio 18:00 ya no se ofrece.

### T-33 — Bloqueo por ausencias
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Al marcar ausencia, contar las de los 30 días anteriores (incluida esta); a la 3ª, `bloqueadoHasta` = ahora + 15 días. Bloqueado: no reserva ni lista; sí cancela lo que conserva. En asignación automática, un primero de lista bloqueado se saltea (RN-28).
- **RN / HU:** RN-26, RN-28, RN-48 · HU-08, HU-04
- **Depende de:** T-31, T-24, T-26
- **Terminada cuando:**
  1. Reloj en `2026-10-01T18:20:00-03:00`: 1ª ausencia. Reloj en `2026-10-10T18:20:00-03:00`: 2ª. Reloj en `2026-10-20T18:20:00-03:00`: 3ª → `bloqueadoHasta = 2026-11-04T18:20:00-03:00`; reservas ya hechas siguen; no puede `POST /reservas` ni lista de espera.
  2. Bloqueado cancela una reserva con ≥24 h → recupera cupo; sigue sin poder anotarse en lista (RN-48).
  3. Lista de las 18:00: Bruno (primero) con `bloqueadoHasta` vigente, Ana (segunda) apta; cancelan ese inicio con ≥1 h → se asigna a Ana, no a Bruno (RN-28).

### T-34 — Desbloqueo
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /usuarios/:usuarioId/desbloqueo`. Las ausencias quedan; el bloqueo no se rearma solo.
- **RN / HU:** RN-39, RN-43 · HU-08
- **Depende de:** T-33, T-09
- **Terminada cuando:**
  1. Administrador desbloquea; sin ausencia nueva el bloqueo no vuelve; las ausencias siguen registradas.
  2. Con deuda impaga tras desbloqueo → sigue sin poder reservar (RN-13).

---

## Etapa 7 — Mantenimiento y administración

### T-35 — Alta de mantenimiento y efecto en reservas
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `POST /mantenimientos` con inicio y fin. En el período no se reserva. Cancela sin cargo solo reservas que se pisan; devuelve cupo; email de mantenimiento a reservas canceladas. Listado y reserva consultan mantenimientos. Usa el bloqueo de la fila de la cancha (plan §6).
- **RN / HU:** RN-36, RN-38 · HU-09
- **Depende de:** T-16, T-21, T-04
- **Terminada cuando:**
  1. Mantenimiento que pisa un pádel 18:00 confirmado: esa reserva cancelada sin deuda, cupo devuelto, email al titular.
  2. En el período, `GET .../turnos` no ofrece esos inicios y `POST /reservas` los rechaza.
  3. Mientras se crea el mantenimiento, un `POST /reservas` concurrente a un turno que se pisa espera el bloqueo y, al terminar, recibe rechazo (turno no disponible por mantenimiento).

### T-36 — Listas y avisos al cargar mantenimiento
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** Al cargar un mantenimiento, se borran las listas de espera de los turnos pisados y se avisa por email a esas personas.
- **RN / HU:** RN-37, RN-38 · HU-09
- **Depende de:** T-35, T-24, T-04
- **Terminada cuando:**
  1. Lista de un turno pisado por el mantenimiento: borrada; Correo de "bloqueo por mantenimiento" a cada anotado.
  2. Tras el borrado, esa lista ya no se usa para asignación ni aviso de rebote.

### T-37 — Resumen de reservas e ingresos
- **Estado:** [ ]
- **Agente:** Tester + Dev backend
- **Qué hacer:** `GET /resumen?dia=&deporte=`. Cantidad = reservas jugadas (confirmada terminada sin ausencia) por día del turno. Ingresos = precio de esas jugadas + deudas pagadas marcadas ese día. Se calcula al consultar.
- **RN / HU:** RN-39, RN-51, RN-60, RN-61 · HU-14
- **Depende de:** T-16, T-22, T-31
- **Terminada cuando:**
  1. Un pádel jugado el día D (turno terminado, sin ausencia) con precio `10400` y una deuda de otro usuario marcada pagada ese día por `6500` → cantidad 1, ingresos `16900` para pádel ese día.
  2. Se marca ausencia sobre esa reserva y se vuelve a consultar → ya no cuenta como jugada; los ingresos de jugadas bajan en consecuencia (RN-61).

---

## Etapa 8 — Frontend

Estas tareas se detallan con casos concretos antes de empezar la etapa 8.

### T-38 — App React, sesión y registro
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** App React + TypeScript. Pantallas de registro (nombre, email, teléfono, contraseña) y entrada. Guardar token y llamar a la API. Usuario no registrado no puede reservar ni anotarse.
- **RN / HU:** RN-50, RN-52, RN-62, RN-07, RN-45 · HU-13, HU-15, HU-01
- **Depende de:** T-06, T-07, T-08
- **Terminada cuando:**
  1. Registro con datos válidos crea usuario y permite entrar.
  2. Contraseña incorrecta no entra.
  3. Sin sesión, las acciones de reservar / lista de espera no están disponibles o fallan con el mensaje de la API.

### T-39 — Explorar canchas, turnos y reservar
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** Listar canchas y turnos del día; mostrar precio al confirmar según respuesta del backend; socio/no socio ven solo lo que la API ofrece. Manejar turno no disponible (concurrencia) y ofrecer ir a lista de espera.
- **RN / HU:** RN-01–RN-06, RN-08, RN-09, RN-17, RN-35, RN-57 · HU-02, HU-03, HU-11, HU-12
- **Depende de:** T-38, T-15, T-16, T-18, T-19, T-20
- **Terminada cuando:**
  1. Socio ve turnos hasta 7 días y puede confirmar uno libre; ve el precio final devuelto.
  2. No socio no puede elegir un turno fuera de su anticipación (la API rechaza / el UI no lo ofrece).
  3. Tras solape o carrera, el UI muestra no disponible y permite anotarse en lista.

### T-40 — Mis reservas: cancelar y rechazar
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** Listar reservas del usuario. Botón cancelar solo si el turno no empezó (el backend igual rechaza). Rechazar asignación automática solo dentro de la hora. Mostrar deuda generada si aplica.
- **RN / HU:** RN-20, RN-21, RN-33 · HU-04, HU-06
- **Depende de:** T-38, T-17, T-21, T-28
- **Terminada cuando:**
  1. Con ≥24 h, cancelar no muestra deuda; con &lt;24 h, informa el 50%.
  2. Llegada la hora de inicio, el botón de cancelar no está.
  3. Con asignación reciente, rechazar funciona; pasada 1 h no ofrece rechazo.

### T-41 — Lista de espera en la UI
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** Anotarse en un turno ocupado; no gastar cupo en la UI; reflejar orden y errores (duplicado, deuda, bloqueo, no ocupado).
- **RN / HU:** RN-12, RN-27, RN-45, RN-48, RN-55, RN-59 · HU-05
- **Depende de:** T-38, T-24, T-25, T-39
- **Terminada cuando:**
  1. En un turno ocupado por solape (ej. 18:30 con reserva 18:00–19:30), el usuario se anota.
  2. Turno libre → no permite anotar.
  3. Segunda anotación al mismo turno → mensaje de que ya está en la lista.

### T-42 — Panel administrador: precios, socios, feriados, rol
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** Pantallas admin: precios base, feriados, marcar socio, dar rol administrador, listar usuarios.
- **RN / HU:** RN-07, RN-15, RN-16, RN-54, RN-57 · HU-12, HU-01, HU-16
- **Depende de:** T-38, T-09, T-10, T-11, T-12
- **Terminada cuando:**
  1. Admin carga precio de pádel `10000` y un feriado; un no admin no ve o no puede usar esas acciones.
  2. Admin marca socio y da rol a otro usuario con éxito.

### T-43 — Panel administrador: ausencias, deudas, desbloqueo, mantenimiento, resumen
- **Estado:** [ ]
- **Agente:** Tester + Dev frontend
- **Qué hacer:** Marcar ausencias del día; marcar deudas pagadas/anuladas; desbloquear; cargar mantenimiento; ver resumen por día y deporte.
- **RN / HU:** RN-22, RN-24, RN-26, RN-36, RN-39, RN-51 · HU-08, HU-09, HU-10, HU-14
- **Depende de:** T-38, T-30, T-31, T-33, T-34, T-22, T-35, T-36, T-37
- **Terminada cuando:**
  1. Admin marca ausencia pasados 15 min y ve la deuda completa; antes de 15 min la acción no aplica.
  2. Admin marca deuda pagada y el usuario puede volver a reservar en la UI.
  3. Admin carga mantenimiento y las reservas pisadas desaparecen como canceladas sin cargo.
  4. Resumen muestra cantidad e ingresos coherentes con un caso de T-37.

---

## Tabla de control — RN → tareas

| RN | Tareas | Estado cobertura |
| --- | --- | --- |
| RN-01 | T-05, T-14, T-39 | ok |
| RN-02 | T-15, T-39 | ok |
| RN-03 | T-15, T-39 | ok |
| RN-04 | T-15, T-39 | ok |
| RN-05 | T-19, T-39 | ok |
| RN-06 | T-15, T-32, T-39 | ok |
| RN-07 | T-09, T-16, T-38, T-42 | ok |
| RN-08 | T-18, T-39 | ok |
| RN-09 | T-18, T-39 | ok |
| RN-10 | T-18 | ok |
| RN-11 | T-21, T-33 | ok |
| RN-12 | T-24, T-26, T-28, T-41 | ok |
| RN-13 | T-23, T-24, T-34 | ok |
| RN-14 | T-09, T-16 | ok |
| RN-15 | T-11, T-16, T-42 | ok |
| RN-16 | T-12, T-13, T-42 | ok |
| RN-17 | T-13, T-16, T-39 | ok |
| RN-18 | T-13, T-16 | ok |
| RN-19 | T-16 | ok |
| RN-20 | T-21, T-28, T-40 | ok |
| RN-21 | T-21, T-40 | ok |
| RN-22 | T-22, T-43 | ok |
| RN-23 | T-31 | ok |
| RN-24 | T-31, T-43 | ok |
| RN-25 | T-32 | ok |
| RN-26 | T-33, T-43 | ok |
| RN-27 | T-24, T-41 | ok |
| RN-28 | T-26, T-28, T-33 | ok |
| RN-29 | T-26 | ok |
| RN-30 | T-27, T-28 | ok |
| RN-31 | T-27, T-32 | ok |
| RN-32 | T-27, T-28 | ok |
| RN-33 | T-28, T-40 | ok |
| RN-34 | T-29 | ok |
| RN-35 | T-02, T-20, T-39 | ok |
| RN-36 | T-35, T-43 | ok |
| RN-37 | T-36 | ok |
| RN-38 | T-04, T-16, T-21, T-26, T-27, T-35, T-36 | ok |
| RN-39 | T-34, T-37, T-43 | ok |
| RN-40 | T-31 | ok |
| RN-41 | T-31 | ok |
| RN-42 | T-22 | ok |
| RN-43 | T-34 | ok |
| RN-44 | T-28 | ok |
| RN-45 | T-24, T-38, T-41 | ok |
| RN-46 | T-26, T-27 | ok |
| RN-47 | T-18, T-31 | ok |
| RN-48 | T-33, T-41 | ok |
| RN-49 | T-25 | ok |
| RN-50 | T-06, T-38 | ok |
| RN-51 | T-37, T-43 | ok |
| RN-52 | T-08, T-38 | ok |
| RN-53 | T-05 | ok |
| RN-54 | T-10, T-42 | ok |
| RN-55 | T-02, T-25, T-41 | ok |
| RN-56 | T-26, T-28 | ok |
| RN-57 | T-15, T-39, T-42 | ok |
| RN-58 | T-13, T-21 | ok |
| RN-59 | T-24, T-41 | ok |
| RN-60 | T-37 | ok |
| RN-61 | T-37 | ok |
| RN-62 | T-02, T-07, T-38 | ok |

Ninguna RN quedó en FALTA.

---

## Archivos tocados

- `docs/tasks.md` (actualizado)

Cubre el desglose de implementación de todas las RN y HU de `docs/spec.md` según la API y capas de `docs/plan.md`.
