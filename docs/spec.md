# ReservaClub — Especificación

## 1. Objetivo

El club toma las reservas por WhatsApp: los turnos se pisan y la gente no avisa si no viene. El sistema web reserva las canchas con un solo turno confirmado por horario, deja registrada la deuda de quien cancela tarde o no viene, y ofrece la cancha que queda libre.

## 2. Usuarios y roles

**Usuario no registrado.** No puede reservar ni anotarse en una lista de espera. Para eso tiene que registrarse.

**Socio.** Usuario registrado a quien el administrador marcó como socio. Reserva con hasta 7 días de anticipación y hasta 2 reservas activas por semana, con 20% de descuento. Puede cancelar, anotarse en una lista de espera y rechazar una asignación automática.

**No socio.** Usuario registrado que el administrador no marcó como socio. Reserva con hasta 3 días de anticipación y 1 reserva activa por semana, sin ese descuento. Puede cancelar, anotarse en una lista de espera y rechazar una asignación automática.

**Administrador.** Carga y modifica los precios base y los feriados. Indica quién es socio. Marca ausencias, marca deudas como pagadas o las anula, y desbloquea usuarios. Bloquea una cancha por mantenimiento. Ve un resumen de reservas e ingresos.

## 3. Alcance

**Entra.** Reserva web de las 6 canchas, con horario, precio, cupo semanal y anticipación. Cancelar, deuda, ausencia y bloqueo del usuario. Lista de espera, asignación automática y liberación de rebote. Mantenimiento, feriados y avisos por email.

**Queda afuera.** El cobro online. Reacomodar un turno a otro horario de inicio. Reservar o cancelar un turno que ya empezó, y ofrecer el tramo ya iniciado. Lo que no está definido, en Pendientes.

## 4. Reglas de negocio

RN-01. Hay 2 canchas de fútbol 5, 3 de pádel y 1 de tenis.
RN-02. Un turno de fútbol 5 dura 60 minutos; un turno de pádel o de tenis dura 90 minutos.
RN-03. El club abre de 8:00 a 00:00 todos los días y los turnos empiezan en punto o y media.
RN-04. Ningún turno termina después de las 00:00: el último de fútbol 5 empieza a las 23:00 y el último de pádel o tenis a las 22:30.
RN-05. Un turno ocupa la cancha durante todo su intervalo y no deja reservar otro que se pise, aunque sea en parte.
RN-06. Se puede reservar un turno hasta el minuto en que empieza; una vez empezado, ya no se ofrece.
RN-07. Para reservar hay que estar registrado, y el administrador indica quién es socio.
RN-08. Un socio reserva desde hoy hasta el mismo día de la semana siguiente, en días de calendario, y tiene hasta 2 reservas activas por semana.
RN-09. Un no socio reserva hasta 3 días después de hoy, en días de calendario, y tiene 1 reserva activa por semana.
RN-10. La semana va de lunes a domingo y el cupo se cuenta por el día del turno, no por el día en que se reservó.
RN-11. Cancelar una reserva devuelve el cupo de esa semana.
RN-12. Anotarse en la lista de espera no gasta cupo; la asignación automática lo gasta al asignarse, y rechazar dentro de la primera hora lo devuelve.
RN-13. Con cualquier deuda impaga no se puede reservar ni anotar en una lista de espera.
RN-14. Las reservas ya hechas conservan el precio y la condición de socio con los que se hicieron; las nuevas usan la condición actual.
RN-15. Cada deporte tiene un precio base. Si el administrador lo cambia, las reservas ya hechas mantienen el precio anterior.
RN-16. Un turno es de horario pico si empieza entre las 18:00 y las 22:59, salvo sábado, domingo y los feriados que carga el administrador.
RN-17. El precio final es el precio base × 1,30 si es horario pico y después × 0,80 si quien reserva es socio; se fija al reservar y se usa para la deuda y para el 50%.
RN-18. El precio depende de quien hace la reserva, aunque juegue con no socios.
RN-19. Si se carga un feriado después de reservar, esa reserva mantiene su precio original.
RN-20. Cancelar con 24 horas o más no genera deuda; con menos de 24 horas genera una deuda del 50% del precio final, aunque el turno se reasigne.
RN-21. Desde la hora de inicio ya no se puede cancelar y el botón desaparece.
RN-22. El sistema no cobra online: la deuda se paga en el club, y el administrador la marca pagada o la anula.
RN-23. Llegar dentro de los 15 minutos permite entrar y jugar; llegar más de 15 minutos tarde es una ausencia.
RN-24. La ausencia solo se marca después de esos 15 minutos: la reserva deja de ocupar la cancha y genera una deuda por el precio final completo, aunque otro use la cancha.
RN-25. Al marcar la ausencia quedan libres los inicios que todavía no empezaron y que esa reserva pisaba, y se tratan como liberación de rebote.
RN-26. Al marcar una ausencia se cuentan las de los 30 días anteriores; si son 3 o más, el usuario queda bloqueado 15 días desde ese momento: no hace reservas nuevas y mantiene las que ya tenía.
RN-27. La lista de espera es de un turno exacto (cancha, día y hora de inicio) y para anotarse rige la misma anticipación que para reservar.
RN-28. En una liberación por cancelación, si falta 1 hora o más, la asignación automática se la da al primero de esa lista que no esté bloqueado, no tenga deuda y tenga cupo esa semana.
RN-29. Si nadie de esa lista puede recibirlo, el turno queda libre para una reserva normal, y las listas de otros inicios no lo reciben por asignación automática.
RN-30. Si falta menos de 1 hora para el inicio, no hay asignación automática: se avisa a toda la lista y lo reserva el primero que entra.
RN-31. En una liberación de rebote no hay asignación automática: se avisa por email a toda la lista, lo reserva el primero que entra, esa persona sale de la lista y los demás siguen anotados.
RN-32. La forma de liberar el turno depende de la causa, no de si es la primera o una vez posterior.
RN-33. Quien recibe una asignación automática puede rechazarla sin cargo durante la primera hora desde el email; al rechazar, el turno se libera como una cancelación de ese inicio exacto, y pasada esa hora la reserva queda firme.
RN-34. Todas las listas de espera de un turno se borran cuando ese turno empieza.
RN-35. Si dos personas confirman a la vez la misma cancha, el mismo día y la misma hora, vale la primera reserva; la otra ve que el turno no está disponible y puede anotarse en la lista de espera.
RN-36. El administrador bloquea una cancha por mantenimiento con inicio y fin; en ese período no se reserva, se cancelan sin cargo solo las reservas que se pisan con ese período, esas reservas devuelven el cupo y se avisa por email a cada persona.
RN-37. Se borran las listas de espera de los turnos que se pisan con ese cierre, y también se avisa por email.
RN-38. Los emails son: reserva confirmada, cancelación, turno recibido por asignación automática, bloqueo por mantenimiento y turno liberado de rebote.
RN-39. El administrador puede desbloquear a un usuario y ve un resumen de reservas e ingresos.
RN-40. Una ausencia sigue ocupando el cupo de esa semana, aunque se pague la deuda.
RN-41. Quien tuvo una ausencia puede reservar un inicio posterior que haya quedado libre, como cualquier persona.
RN-42. La deuda no vence: impide reservar hasta que el administrador la marca como pagada o la anula.
RN-43. Si el administrador desbloquea a un usuario, las ausencias siguen registradas, pero el bloqueo no vuelve solo: el sistema solo vuelve a evaluar cuando se marca una ausencia nueva.
RN-44. Al rechazar una asignación automática dentro de la primera hora, el turno se libera como una cancelación de ese inicio exacto: si falta 1 hora o más se aplica la asignación automática, y si falta menos se avisa a toda la lista.
RN-45. Para anotarse en una lista de espera hay que estar registrado.
RN-46. En esta versión, el sistema no mueve una reserva ni una lista de espera a otro horario de inicio.
RN-47. Una reserva activa es una reserva confirmada de esa semana, por el día del turno, que no se canceló ni se rechazó. Las reservas jugadas y las ausencias siguen contando para el cupo.
RN-48. Un usuario bloqueado no puede anotarse en listas de espera. Sí puede cancelar las reservas que conserva, con las reglas normales.
RN-49. La lista de espera se ordena por orden de llegada.
RN-50. El registro pide nombre, email y teléfono.
RN-51. El resumen del administrador muestra, por día y por deporte, la cantidad de reservas y los ingresos: el precio de las reservas jugadas más las deudas pagadas.

## 5. Historias de usuario

### HU-01
Como usuario no registrado, quiero registrarme, para poder reservar una cancha.

- Dado que no tengo usuario, Cuando intento reservar, Entonces el sistema no crea la reserva (RN-07).
- Dado que ya estoy registrado, Cuando el administrador me marca como socio o me deja como no socio, Entonces mis reservas nuevas usan esa condición (RN-07, RN-14).

### HU-02
Como socio, quiero reservar un turno, para jugar hasta el mismo día de la semana siguiente.

- Dado que soy socio, no tengo deuda y tengo menos de 2 reservas activas en la semana del turno, Cuando reservo un turno libre dentro de ese plazo, Entonces la reserva queda confirmada con el precio final de ese momento (RN-08, RN-10, RN-13, RN-17).
- Dado que ya jugué un turno de esa semana o tuve una ausencia, Cuando cuento mis reservas activas, Entonces esas reservas siguen en el cupo (RN-47).
- Dado un pádel de 18:00 a 19:30, Cuando otro intenta reservar esa cancha a las 17:00, 17:30, 18:30 o 19:00, Entonces el sistema no se lo da (RN-05).
- Dado que el turno ya empezó, Cuando alguien intenta reservarlo, Entonces ya no se ofrece (RN-06).

### HU-03
Como no socio, quiero reservar un turno, para jugar dentro de mi anticipación y mi cupo.

- Dado que soy no socio, Cuando el turno es más de 3 días después de hoy o ya tengo 1 reserva activa en esa semana, Entonces no puedo reservarlo (RN-09, RN-10).
- Dado que reservo en horario pico un día de semana, Cuando el sistema calcula el precio, Entonces no aplica el × 0,80 (RN-16, RN-17, RN-18).

### HU-04
Como usuario con una reserva, quiero cancelarla, para liberar la cancha y saber si me queda deuda.

- Dado que faltan 24 horas o más y el turno no empezó, Cuando cancelo, Entonces no hay deuda y recupero el cupo de esa semana (RN-11, RN-20).
- Dado que faltan menos de 24 horas y el turno no empezó, Cuando cancelo, Entonces queda una deuda del 50% del precio final aunque el turno se reasigne (RN-20).
- Dado que llegó la hora de inicio, Cuando busco cancelar, Entonces el botón ya no está (RN-21).
- Dado que estoy bloqueado y conservo una reserva, Cuando la cancelo faltando 24 horas o más, Entonces recupero el cupo, y no puedo anotarme en una lista de espera (RN-11, RN-48).

### HU-05
Como usuario, quiero anotarme en la lista de espera de un turno ocupado, para tomarlo si se libera.

- Dado que el turno está ocupado y estoy dentro de mi anticipación, sin deuda, Cuando me anoto, Entonces no gasto una reserva activa (RN-12, RN-13, RN-27).
- Dado que no estoy registrado, Cuando intento anotarme en una lista de espera, Entonces el sistema no me anota (RN-45).
- Dado que dos personas se anotan en la misma lista, Cuando se libera el turno, Entonces queda primero quien llegó antes (RN-49).
- Dado que alguien cancela ese inicio exacto y falta 1 hora o más, Cuando el sistema lo libera, Entonces se lo asigna al primero de esa lista que no esté bloqueado, no deba y tenga cupo, y esa asignación gasta el cupo (RN-12, RN-28).
- Dado que nadie de esa lista puede recibirlo, Cuando la liberación por cancelación termina, Entonces el turno queda libre y las listas de otros inicios no lo reciben solas (RN-29).

### HU-06
Como usuario que recibió una asignación automática, quiero rechazarla, para no quedarme con un turno que no elegí.

- Dado que el email llegó hace menos de 1 hora, Cuando rechazo, Entonces no hay deuda, vuelve el cupo y el turno se libera como una cancelación de ese inicio exacto: asignación automática si falta 1 hora o más, y aviso a toda la lista si falta menos (RN-12, RN-28, RN-30, RN-33, RN-44).
- Dado que pasó 1 hora desde el email, Cuando esa reserva sigue en pie, Entonces quedó firme y cancelarla usa la regla de las 24 horas (RN-20, RN-33).

### HU-07
Como usuario de una lista de espera, quiero enterarme si el turno se libera de rebote, para reservarlo yo antes que otro.

- Dado que el horario quedó libre sin una cancelación de ese inicio exacto, Cuando el sistema avisa, Entonces no se lo asigna a nadie y lo reserva el primero que entra (RN-31).
- Dado que alguien cancela ese inicio y falta menos de 1 hora, Cuando el sistema avisa, Entonces ocurre lo mismo que en una liberación de rebote (RN-30).
- Dado que yo lo reservé, Cuando la reserva se confirma, Entonces salgo de la lista y los demás siguen anotados (RN-31).
- Dado que se cancela el pádel de las 18:00 y hay gente en la lista de las 18:30, Cuando el sistema libera el turno, Entonces no mueve esa reserva ni esa lista a otro horario de inicio (RN-46).

### HU-08
Como administrador, quiero marcar una ausencia, para liberar la cancha y dejar la deuda de quien no llegó a tiempo.

- Dado que pasaron más de 15 minutos del inicio, Cuando marco la ausencia, Entonces la reserva deja de ocupar la cancha y queda una deuda por el precio final completo (RN-23, RN-24).
- Dado un pádel de 18:00 a 19:30 marcado como ausencia antes de las 18:30, Cuando se libera la cancha, Entonces las 18:30 y las 19:00 quedan libres y se avisa a sus listas (RN-25, RN-31).
- Dado que la persona llegó a los 10 minutos, Cuando el administrador intenta marcar la ausencia, Entonces el sistema no lo permite (RN-23, RN-24).
- Dado que marqué la ausencia y el usuario pagó la deuda, Cuando intenta otra reserva en esa misma semana, Entonces la ausencia sigue ocupando el cupo (RN-40).
- Dado que marqué la ausencia y quedó libre un inicio posterior, Cuando esa persona lo reserva con las mismas reglas que cualquier otra, Entonces puede quedarse con ese inicio (RN-41).
- Dado que el administrador desbloqueó al usuario y no se marcó una ausencia nueva, Cuando el sistema vuelve a mirar el bloqueo, Entonces no lo aplica de nuevo y las ausencias siguen registradas (RN-43).

### HU-09
Como administrador, quiero bloquear una cancha por mantenimiento, para que nadie la reserve mientras está cerrada.

- Dado un inicio y un fin, Cuando bloqueo la cancha, Entonces en ese período no se puede reservar, se cancelan sin cargo solo las reservas que se pisan con ese período, esas reservas devuelven el cupo y cada persona recibe un email (RN-36, RN-38).
- Dado un turno que se pisa con ese cierre, Cuando el bloqueo queda cargado, Entonces su lista de espera se borra y también se avisa (RN-37).

### HU-10
Como administrador, quiero marcar una deuda como pagada o anularla, para que esa persona vuelva a reservar.

- Dado que el usuario tiene una deuda impaga, Cuando intenta reservar o anotarse en una lista, Entonces el sistema no lo deja (RN-13, RN-22).
- Dado que marqué pagas o anuladas todas sus deudas, Cuando intenta una reserva nueva y cumple cupo, anticipación y bloqueo, Entonces ya puede (RN-13, RN-22).
- Dado que la deuda sigue impaga, Cuando pasa el tiempo y el usuario intenta reservar, Entonces la deuda no venció y el sistema no lo deja (RN-42).

### HU-11
Como usuario, quiero que dos reservas simultáneas no se queden con el mismo turno, para no pisarme con otro.

- Dado que otro confirmó antes la misma cancha, el mismo día y la misma hora, Cuando yo confirmo, Entonces veo que el turno no está disponible y puedo anotarme en la lista de espera (RN-35).

### HU-12
Como administrador, quiero cargar precios, socios y feriados, para que el precio final quede fijo en cada reserva.

- Dado un pádel de día de semana a las 20:00 con precio base $10.000 reservado por un socio, Cuando se confirma, Entonces el precio final es $10.400 (RN-16, RN-17).
- Dado que después cambio el precio base o cargo ese día como feriado, Cuando miro la reserva ya hecha, Entonces mantiene el precio original (RN-15, RN-19).
- Dado que le quito la condición de socio a quien ya reservó, Cuando miro esa reserva, Entonces conserva la condición y el precio con los que se hizo (RN-14).

### HU-13
Como usuario no registrado, quiero dejar mi nombre, email y teléfono, para poder reservar.

- Dado que completo nombre, email y teléfono, Cuando me registro, Entonces el sistema crea mi usuario (RN-50).

### HU-14
Como administrador, quiero ver el resumen por día y por deporte, para conocer las reservas y los ingresos.

- Dado que hay reservas jugadas y deudas pagadas, Cuando miro un día y un deporte, Entonces veo la cantidad de reservas y los ingresos como el precio de las jugadas más las deudas pagadas (RN-51).

## 6. Casos borde

- Pádel de 18:00 a 19:30: no se puede reservar esa cancha a las 17:00, 17:30, 18:30 ni 19:00. El siguiente inicio libre es a las 19:30 (RN-05).
- Se puede reservar hasta el minuto de inicio. Un minuto después, ese turno ya no se ofrece (RN-06).
- Fútbol 5 a las 23:00 de un día de semana: no es horario pico, porque no empieza entre las 18:00 y las 22:59 (RN-04, RN-16).
- Sábado o domingo a las 20:00, o un feriado en ese horario: no se multiplica por 1,30 (RN-16).
- Cancelar con exactamente 24 horas: no hay deuda. Con menos, la deuda es el 50% del precio final aunque otra persona se quede con el turno (RN-20).
- Llegar a los 15 minutos: puede jugar. Llegar a los 16: es ausencia; la deuda por el precio final completo y la liberación de la cancha ocurren cuando el administrador marca la ausencia (RN-23, RN-24).
- Marcar la ausencia antes de que pasen 15 minutos: no está permitido (RN-24).
- Ausencia de un pádel de 18:00 a 19:30 marcada a las 18:20: se liberan las 18:30 y las 19:00 si todavía no empezaron; el turno de las 18:00 ya no se ofrece (RN-06, RN-25).
- Cancelar las 18:00 con 1 hora o más por delante: asignación automática solo a la lista de las 18:00. La lista de las 18:30 no lo recibe sola (RN-28, RN-29).
- Cancelar ese inicio cuando falta menos de 1 hora: no hay asignación automática; se avisa a toda la lista (RN-30).
- Nadie de la lista puede recibir el turno: queda libre para una reserva normal (RN-29).
- Rechazar a los 30 minutos del email: sin deuda, el cupo vuelve y el turno se libera como una cancelación de ese inicio exacto, por RN-28 o RN-30 según cuánto falte. Rechazar pasada 1 hora: ya no es rechazo; la reserva está firme (RN-12, RN-33, RN-44).
- La lista de un turno se borra cuando ese turno empieza, aunque nadie lo haya reservado (RN-34).
- La tercera ausencia bloquea 15 días desde ese momento. Las reservas ya hechas siguen. Una deuda impaga sigue impidiendo reservas nuevas aunque el administrador desbloquee al usuario (RN-13, RN-26, RN-39).
- Dos confirmaciones simultáneas del mismo turno: vale la primera (RN-35).

## 7. Pendientes

Sin pendientes.
