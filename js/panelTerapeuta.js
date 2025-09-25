document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("../BaseDatos/panelTerapeuta.php");
        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return;
        }

        // Estadísticas
        document.getElementById("citasHoy").textContent = data.citasHoy.length;
        document.getElementById("pacientesActivos").textContent = data.pacientesActivos;
        document.getElementById("citasCanceladas").textContent = data.citasCanceladas;

        // Próxima cita
        const prox = document.getElementById("proximaCita");
        if (data.proximaCita) {
            prox.innerHTML = `
                <dl>
                    <dt>Paciente:</dt><dd>${data.proximaCita.nombres} ${data.proximaCita.apellidos}</dd>
                    <dt>Fecha:</dt><dd>${data.proximaCita.fecha_cita}</dd>
                    <dt>Hora:</dt><dd>${data.proximaCita.hora_inicio}</dd>
                </dl>
            `;
        } else {
            prox.textContent = "No hay citas programadas";
        }

        // Notificaciones
        const notiContainer = document.getElementById("notificaciones");
        data.notificaciones.forEach(n => {
            const p = document.createElement("p");
            p.textContent = `${n.nombres} ${n.apellidos} - ${n.fecha_cita} ${n.hora_inicio} (${n.estado_cita})`;
            notiContainer.appendChild(p);
        });

        // Tratamientos activos
        const trContainer = document.getElementById("tratamientosActivos");
        data.tratamientosActivos.forEach(t => {
            const li = document.createElement("li");
            li.textContent = `${t.nombres} ${t.apellidos} - ${t.nombre_procedimiento} (${t.estado})`;
            trContainer.appendChild(li);
        });

        // Citas programadas
        const cpContainer = document.getElementById("citasProgramadas");
        data.citasProgramadas.forEach(c => {
            const li = document.createElement("li");
            li.textContent = `${c.fecha_cita} ${c.hora_inicio} - ${c.nombres} ${c.apellidos} (${c.estado})`;
            cpContainer.appendChild(li);
        });

    } catch (err) {
        console.error("Error cargando los datos del panel:", err.message);
    }

    // calendario
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }
    });
    calendar.render();
});