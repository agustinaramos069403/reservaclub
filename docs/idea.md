# ReservaClub — Idea del cliente

Somos un club de barrio. Hoy tomamos las reservas por WhatsApp y es un caos: se pisan turnos y la gente no avisa si no viene. Queremos un sistema web para reservar canchas.

## Canchas

- 2 canchas de fútbol 5. Cada turno dura 60 minutos y ocupa la cancha durante todo ese intervalo.
- 3 canchas de pádel. Cada turno dura 90 minutos y ocupa la cancha durante todo ese intervalo.
- 1 cancha de tenis. Cada turno dura 90 minutos y ocupa la cancha durante todo ese intervalo.
- [NUEVO] Dos turnos se pisan si uno empieza antes de que termine el otro. Ejemplo: con un pádel de 18:00 a 19:30, no se puede reservar a las 17:00, 17:30, 18:30 ni 19:00; el siguiente inicio libre es a las 19:30.
- [NUEVO] Se puede reservar un turno hasta el minuto en que empieza. Una vez que empezó, ya no se ofrece.

## Horario

- El club abre de 8:00 a 00:00, todos los días.
- Los turnos empiezan en punto o y media (8:00, 8:30, 9:00...).
- Ningún turno puede terminar después de las 00:00. El último turno de fútbol 5 empieza a las 23:00, y el último de pádel o tenis, a las 22:30.
- [CAMBIO] Un turno es de horario pico si empieza entre las 18:00 y las 22:59.
- [CAMBIO] Los fines de semana y feriados no son horario pico. El fin de semana es sábado y domingo, y los feriados los carga el administrador.
- [NUEVO] Si se carga un feriado después de reservar, esa reserva mantiene su precio original.
- [NUEVO] El administrador puede bloquear una cancha con fecha y hora de inicio y fin. Durante ese período, la cancha no se puede reservar.

## Clientes

- Para reservar hay que registrarse en el sistema. El administrador indica quién es socio.
- [CAMBIO] **Socios:** pueden reservar con hasta 7 días de anticipación, en días de calendario, desde hoy hasta el mismo día de la semana siguiente.
- [CAMBIO] **No socios:** pueden reservar con hasta 3 días de anticipación, en días de calendario.
- [CAMBIO] La semana va de lunes a domingo. Lo que cuenta es el día del turno, no el día en que se reservó.
- [CAMBIO] **Socios:** tienen hasta 2 reservas activas por semana. **No socios:** tienen 1 reserva activa por semana.
- [NUEVO] La anticipación se cuenta en días de calendario. El socio puede reservar desde hoy hasta el mismo día de la semana siguiente; el no socio, hasta 3 días después de hoy.
- [NUEVO] Si alguien cancela una reserva, recupera ese cupo de la semana.
- [NUEVO] Con cualquier deuda impaga no se puede reservar ni anotar en una lista de espera.
- [NUEVO] Las reservas ya hechas conservan la condición de socio con la que se hicieron; las nuevas usan la condición actual.

## Precios

- Cada deporte tiene un precio base que carga el administrador.
- [CAMBIO] En horario pico, el turno es 30% más caro.
- [CAMBIO] Los socios tienen 20% de descuento.
- [CAMBIO] El recargo y el descuento se multiplican, no se suman: primero el precio base × 1,30 si es pico, y después ese resultado × 0,80 si es socio.
- [NUEVO] Ejemplo: pádel a las 20:00, precio base $10.000, reserva un socio → $10.000 × 1,30 × 0,80 = $10.400.
- [NUEVO] El precio final se fija al reservar y se usa para las deudas y para el cálculo de cancelaciones tardías.
- [NUEVO] El precio depende de quién hace la reserva, aunque juegue con no socios.
- [NUEVO] Si el administrador cambia un precio base, las reservas ya hechas mantienen el precio anterior.
- [NUEVO] Las reservas ya hechas conservan el precio y la condición con la que se hicieron. Las nuevas usan la condición actual.

## Cancelaciones y ausencias

- [CAMBIO] Si cancelan con 24 horas o más de anticipación, no pasa nada.
- [CAMBIO] Si cancelan con menos de 24 horas, se cobra el 50% del turno.
- [CAMBIO] El sistema no cobra online: registra una deuda que se paga en el club.
- [CAMBIO] Quien tiene una deuda no puede hacer nuevas reservas hasta pagarla. El administrador marca la deuda como pagada o la anula.
- [CAMBIO] Llegar más de 15 minutos tarde cuenta como ausencia. Las ausencias las marca el administrador.
- [CAMBIO] La ausencia solo se puede marcar después de los 15 minutos de tolerancia. Al marcarla, la reserva deja de ocupar la cancha y los inicios que todavía no empezaron y que esa reserva pisaba quedan libres.
- [NUEVO] Si una reserva se marca como ausencia, se genera una deuda por el turno completo, aunque otra persona termine usando la cancha.
- [NUEVO] Desde que el turno empieza, ya no se puede cancelar. El botón de cancelar desaparece a la hora de inicio.
- [NUEVO] Si alguien llega tarde, puede entrar y jugar si llega dentro de los 15 minutos de tolerancia; si llega después, cuenta como ausencia y debe el turno completo.
- [NUEVO] Si un usuario tiene 3 ausencias en 30 días, queda bloqueado por 15 días desde ese momento.
- [NUEVO] Un usuario bloqueado no puede hacer nuevas reservas, pero mantiene las que ya tenía.

## Lista de espera

- [CAMBIO] Si un turno está ocupado, la persona puede anotarse en una lista de espera por turno exacto: cancha, día y hora de inicio.
- [NUEVO] Anotarse en la lista de espera no cuenta para el límite de reservas semanales.
- [CAMBIO] Si alguien cancela un inicio exacto y falta 1 hora o más para el turno, el sistema lo asigna automáticamente al primero de esa lista que pueda recibirlo: que no esté bloqueado, que no tenga deudas y que tenga cupo esa semana.
- [NUEVO] Si en esa lista no hay nadie que pueda recibirlo, el horario queda libre y cualquiera puede reservarlo. Las listas de otros inicios no reciben el turno automáticamente.
- [NUEVO] Si un horario queda libre de rebote, el sistema avisa por email a toda su lista y lo reserva el primero que entra. Nadie recibe el turno automáticamente.
- [NUEVO] Si alguien cancela un inicio exacto y falta menos de 1 hora para el turno, no se asigna automáticamente; se avisa a toda la lista igual que en el caso de rebote.
- [NUEVO] Quien reserva un turno de la lista sale de esa lista. Los demás siguen anotados.
- [NUEVO] Todas las listas de espera de un turno se borran cuando ese turno empieza.
- [NUEVO] Para anotarse en una lista de espera rige la misma anticipación que para reservar.
- [NUEVO] Con cualquier deuda impaga no se puede anotar en una lista de espera.
- [NUEVO] Una reserva asignada desde la lista gasta el cupo al asignarse. Si se rechaza dentro de la primera hora, el cupo vuelve.
- [NUEVO] Quien recibe un turno por asignación automática puede rechazarlo sin cargo durante la primera hora desde que le llega el email. Al rechazarlo, el turno se asigna al siguiente de la lista.
- [NUEVO] Pasada esa hora, la reserva queda firme y se cancela con las reglas normales.
- [NUEVO] Si alguien cancela tarde y el turno se reasigna, igual se le cobra el 50%.

## Concurrencia

- [CAMBIO] Dos personas pueden intentar reservar la misma cancha, el mismo día y a la misma hora, al mismo tiempo.
- [CAMBIO] El sistema nunca puede dar el mismo turno dos veces.
- [CAMBIO] Si eso pasa, la primera reserva que se confirma es la que vale. La otra persona ve un mensaje de que el turno ya no está disponible y la opción de anotarse en la lista de espera.

## Avisos

- [CAMBIO] Todos los avisos se envían por email: reserva confirmada, cancelación, turno recibido desde la lista de espera, bloqueo de cancha por mantenimiento y avisos de turnos liberados de rebote.
- [NUEVO] Si una reserva se reasigna desde la lista, la persona que la recibe recibe un email.
- [NUEVO] Cuando una cancha queda bloqueada por mantenimiento, se avisa por email a cada persona afectada y se borran las listas de espera de los turnos que se pisan con ese cierre.

## Administrador

- [CAMBIO] Carga y modifica los precios base.
- [CAMBIO] Indica quién es socio.
- [CAMBIO] Marca las ausencias y las deudas pagadas o anula deudas.
- [CAMBIO] Puede desbloquear usuarios.
- [CAMBIO] Puede bloquear una cancha por mantenimiento con fecha y hora de inicio y fin. Las reservas afectadas se cancelan sin cargo y se avisa por email a cada persona.
- [NUEVO] Durante el período de mantenimiento, la cancha no se puede reservar.
- [NUEVO] Las listas de espera de los turnos afectados se borran y también se avisa por email.
- [NUEVO] Ve un resumen de reservas e ingresos.
- [NUEVO] Carga los feriados del calendario.

## Pendientes

