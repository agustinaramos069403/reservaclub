# Decisiones

Una decisión por línea. Cada una responde una duda de la entrevista o de `preguntas-abiertas.md`.

## Ocupación de la cancha

- D-01 Un turno ocupa la cancha durante todo su intervalo. Dos turnos se pisan si uno empieza antes de que termine el otro. Ejemplo: con un pádel de 18:00 a 19:30, no se puede reservar a las 17:00, 17:30, 18:30 ni 19:00. El siguiente inicio libre es a las 19:30.
- D-02 Se puede reservar un turno hasta el minuto en que empieza. Una vez que empezó, ya no se ofrece.

## Lista de espera

- D-03 La lista de espera es por turno exacto: cancha, día y hora de inicio.
- D-04 Si alguien cancela un inicio exacto y falta 1 hora o más para el turno, el sistema lo asigna automáticamente al primero de esa lista que pueda recibirlo. Esto vale siempre, sin importar cuántas veces se haya liberado ese turno.
- D-05 Si en esa lista no hay nadie que pueda recibirlo, el horario queda libre y cualquiera puede reservarlo. Las listas de otros inicios no reciben el turno automáticamente.
- D-06 Si un horario queda libre de rebote (sin que nadie cancele ese inicio exacto), el sistema avisa por email a toda su lista y lo reserva el primero que entre. Nadie recibe el turno automáticamente.
- D-07 Si alguien cancela un inicio exacto y falta menos de 1 hora para el turno, no se asigna automáticamente: se avisa a toda la lista, igual que en D-06.
- D-08 Quien reserva un turno de la lista sale de esa lista. Los demás siguen anotados.
- D-09 Todas las listas de espera de un turno se borran cuando ese turno empieza.
- D-10 Para anotarse en una lista de espera rige la misma anticipación que para reservar.
- D-11 Con cualquier deuda impaga no se puede anotar en una lista de espera.

## Rechazar un turno asignado

- D-12 Quien recibe un turno por asignación automática puede rechazarlo sin cargo durante la primera hora desde que le llega el email. Al rechazarlo, el turno se asigna al siguiente de la lista (D-04).
- D-13 Pasada esa hora, la reserva queda firme y se cancela con las reglas normales.

## Cupo semanal y anticipación

- D-14 Una reserva asignada desde la lista gasta el cupo al asignarse. Si se rechaza dentro de la hora, el cupo vuelve.
- D-15 Una ausencia no devuelve el cupo de esa semana, aunque se pague la deuda.
- D-16 La anticipación se cuenta en días de calendario. El socio puede reservar desde hoy hasta el mismo día de la semana siguiente. El no socio, hasta 3 días después de hoy.

## Cancelaciones y ausencias

- D-17 Desde que el turno empieza, ya no se puede cancelar. El botón de cancelar desaparece a la hora de inicio.
- D-18 Llegar más de 15 minutos tarde es una ausencia, igual que no venir: no juega y debe el turno completo. Puede reservar un inicio posterior que haya quedado libre, como cualquier persona.
- D-19 La ausencia solo se puede marcar después de los 15 minutos de tolerancia.
- D-20 Al marcar la ausencia, la reserva deja de ocupar la cancha. Los inicios que todavía no empezaron y que esa reserva pisaba quedan libres, y se avisa a sus listas (D-06).
- D-21 Una ausencia genera una deuda por el turno completo, aunque otra persona termine usando la cancha.

## Deudas

- D-22 Las deudas se calculan sobre el precio final de la reserva (base, pico y descuento), fijado al reservar. Un cambio posterior del precio base no las modifica.
- D-23 La deuda no vence. Impide reservar hasta que el administrador la marca como pagada. El administrador también puede anularla.
- D-24 Con cualquier deuda impaga no se puede reservar. Hay que pagar todas.

## Bloqueo de usuarios

- D-25 Al marcar una ausencia, el sistema cuenta las ausencias de los 30 días anteriores. Si son 3 o más, bloquea al usuario por 15 días desde ese momento.
- D-26 Si el administrador desbloquea a un usuario, las ausencias siguen registradas, pero el bloqueo no vuelve solo. El sistema solo vuelve a evaluar cuando se marca una ausencia nueva.

## Condición de socio

- D-27 Las reservas ya hechas conservan el precio y la condición con la que se hicieron. Las nuevas usan la condición actual.
- D-28 El tope semanal se controla contando todas las reservas activas de esa semana.

## Mantenimiento

- D-29 El administrador bloquea una cancha con fecha y hora de inicio y de fin. Durante ese período, la cancha no se puede reservar.
- D-30 Se cancelan sin cargo solo las reservas que se pisan con ese período, y se avisa por email. Las listas de espera de esos turnos se borran, y también se avisa.

## Horario pico

- D-31 El fin de semana es sábado y domingo. Los feriados los carga el administrador.
- D-32 Si se carga un feriado después de reservar, esas reservas mantienen su precio.
- D-33 Para anotarse en una lista de espera hay que estar registrado.
- D-34 En esta versión, el sistema no mueve una reserva ni una lista de espera a otro horario de inicio.
- D-35 Una reserva activa es una reserva confirmada de esa semana (por el día del turno) que no se canceló ni se rechazó. Las reservas jugadas y las ausencias siguen contando para el cupo.
- D-37 Un usuario bloqueado no puede anotarse en listas de espera. Sí puede cancelar las reservas que conserva, con las reglas normales.
- D-39 La lista de espera se ordena por orden de llegada.
- D-40 El registro pide nombre, email y teléfono.
- D-41 El resumen del administrador muestra, por día y por deporte, la cantidad de reservas y los ingresos: el precio de las reservas jugadas más las deudas pagadas.
- D-42 Para entrar al sistema se usa email y contraseña; el registro pide también contraseña. Hay un administrador inicial que se crea con el sistema; solo un administrador puede dar ese rol a otro usuario.
- D-43 En el resumen, la cantidad cuenta las reservas jugadas por el día del turno. Los ingresos suman el precio de las reservas jugadas por el día del turno, y las deudas pagadas por el día en que el administrador las marcó como pagadas.
- D-44 Una persona puede estar una sola vez en cada lista de espera.
- D-45 Quien recibe una asignación automática sale de la lista en ese momento. Si la rechaza, no vuelve a la lista sola; puede anotarse de nuevo y queda última.
- D-46 Un deporte sin precio base cargado no se ofrece para reservar.
- D-47 El precio final y el 50% de una cancelación se redondean al peso entero más cercano.
- D-48 Un turno está ocupado si no se puede reservar porque se pisa con una reserva confirmada, aunque no empiece a la misma hora. Solo se puede anotar en la lista de un turno ocupado.
- D-49 Una reserva jugada es una confirmada cuyo turno terminó y no tiene ausencia marcada. El resumen se calcula al consultarlo: si después se marca una ausencia, el resumen cambia.
- D-50 En el redondeo, el medio peso se redondea hacia arriba.
- D-51 La hora para rechazar corre desde que el sistema envía el email.
- D-52 El email es único. Si ya existe un usuario con ese email, el registro se rechaza.