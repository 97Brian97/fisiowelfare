document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) { window.location.href = "../index.html"; return; }

    // Bienvenida y fecha
    document.getElementById("bienvenida").textContent =
        `👋 ¡Bienvenido/a, ${usuario.nombres} ${usuario.apellidos}!`;
    const hoy = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector(".welcome p").textContent = `Hoy es ${hoy.toLocaleDateString('es-ES', opciones)}`;

    // Fetch datos del paciente
    fetch(`../BaseDatos/getDatosPaciente.php?id_paciente=${usuario.id}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.message);

            const cita = data.proximaCita;
            const btnReprogramar = document.querySelector("#proximaCita .btn-primary");
            const btnCancelar = document.querySelector("#proximaCita .btn-secondary");

            if (cita) {
                document.getElementById("citaTipo").textContent = "Próxima cita";
                document.getElementById("citaNombreTratamiento").textContent =
                    `${cita.tipo_consulta || "-"} - ${cita.terapia || "-"}`;
                document.getElementById("citaFecha").textContent = cita.fecha_cita;
                document.getElementById("citaHora").textContent = cita.hora_inicio ? cita.hora_inicio.split(" ")[1] : "-";

                btnReprogramar.disabled = false;
                btnCancelar.disabled = false;

                btnReprogramar.addEventListener("click", () => {
                    if (!cita?.id_cita) {
                        alert("No hay cita para reprogramar.");
                        return;
                    }
                    window.location.href = `reprogramarCita.html?id_cita=${cita.id_cita}`;
                });

                btnCancelar.addEventListener("click", () => {
                    if (confirm("¿Deseas cancelar esta cita?")) {
                        fetch(`../BaseDatos/cancelarCita.php?id_cita=${cita.id}`, { method: "POST" })
                            .then(res => res.json())
                            .then(res => {
                                if (res.success) {
                                    alert("Cita cancelada correctamente.");
                                    location.reload();
                                } else {
                                    alert("No se pudo cancelar la cita: " + res.message);
                                }
                            })
                            .catch(err => { console.error(err); alert("Error al cancelar la cita."); });
                    }
                });
            } else {
                btnReprogramar.disabled = true;
                btnCancelar.disabled = true;
            }

            // Tratamiento activo
            const trat = data.tratamientoActivo;
            if (trat) {
                document.getElementById("tratamientoNombre").textContent = trat.nombre_procedimiento;
                document.getElementById("tratamientoSesiones").textContent = `Estado: ${trat.estado}`;
            }

            // Actividad reciente
            const contenedorActividades = document.getElementById("actividadReciente");
            contenedorActividades.innerHTML = "";
            data.actividadesRecientes.forEach(act => {
                const dl = document.createElement("dl");
                dl.innerHTML = `
                    <dd>Consulta: ${act.tipo_consulta || "-"}</dd>
                    <dd>Terapia: ${act.nombre_procedimiento || "-"}</dd>
                    <dd>Fecha: ${act.fecha_cita}</dd>
                    <dd>Estado: ${act.estado}</dd>
                `;
                contenedorActividades.appendChild(dl);
            });

            // Resumen
            const resumen = data.resumen;
            const contenedorResumen = document.getElementById("resumenPaciente");
            contenedorResumen.innerHTML = `
                <dl>
                    <dd>Citas atendidas: ${resumen.atendidas || 0}</dd>
                    <dd>Citas programadas: ${resumen.programadas || 0}</dd>
                    <dd>Citas canceladas: ${resumen.canceladas || 0}</dd>
                </dl>
            `;
        })
        .catch(err => { console.error(err); alert("No se pudieron cargar los datos del paciente."); });

    // Agendar
    document.getElementById("btnAgendarCita").addEventListener("click", () => {
        window.location.href = "agendarCita.html";
    });
});
