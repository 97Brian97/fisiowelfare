document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "../index.html";
        return;
    }

    // --- Bienvenida y fecha ---
    document.getElementById("bienvenida").textContent =
        `👋 ¡Bienvenido/a, ${usuario.nombres} ${usuario.apellidos}!`;
    const hoy = new Date();
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.querySelector(".welcome p").textContent =
        `Hoy es ${hoy.toLocaleDateString("es-ES", opciones)}`;

    // --- Referencias a elementos ---
    const btnReprogramar = document.querySelector("#proximaCita .btn-primary");
    const btnCancelar = document.querySelector("#proximaCita .btn-secondary");

    // Modal
    const modal = document.getElementById("modalReagendar");
    const formReagendar = document.getElementById("formReagendar");

    let cita = null;

    // --- Fetch datos del paciente ---
    fetch(`../BaseDatos/getDatosPaciente.php?id_paciente=${usuario.id}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) throw new Error(data.message);

            // ---- Próxima cita ----
            if (data.proximaCita) {
                cita = {
                    id_cita: data.proximaCita.id_cita || data.proximaCita.id, // 👈 aseguro id_cita
                    fecha_cita: data.proximaCita.fecha_cita,
                    hora_inicio: data.proximaCita.hora_inicio,
                    tipo_consulta: data.proximaCita.tipo_consulta,
                    terapia: data.proximaCita.terapia
                };

                document.getElementById("citaTipo").textContent = "Próxima cita";
                document.getElementById("citaNombreTratamiento").textContent =
                    `${cita.tipo_consulta || "-"} - ${cita.terapia || "-"}`;
                document.getElementById("citaFecha").textContent = cita.fecha_cita;
                document.getElementById("citaHora").textContent = cita.hora_inicio
                    ? cita.hora_inicio.split(" ")[1]
                    : "-";

                btnReprogramar.disabled = false;
                btnCancelar.disabled = false;
            } else {
                btnReprogramar.disabled = true;
                btnCancelar.disabled = true;
            }

            // ---- Tratamiento activo ----
            const trat = data.tratamientoActivo;
            if (trat) {
                document.getElementById("tratamientoNombre").textContent = trat.nombre_procedimiento;
                document.getElementById("tratamientoSesiones").textContent = `Estado: ${trat.estado}`;
            }

            // ---- Actividad reciente ----
            const contenedorActividades = document.getElementById("actividadReciente");
            contenedorActividades.innerHTML = "";
            data.actividadesRecientes.forEach((act) => {
                const dl = document.createElement("dl");
                dl.innerHTML = `
                    <dd>Consulta: ${act.tipo_consulta || "-"}</dd>
                    <dd>Terapia: ${act.nombre_procedimiento || "-"}</dd>
                    <dd>Fecha: ${act.fecha_cita}</dd>
                    <dd>Estado: ${act.estado}</dd>
                `;
                contenedorActividades.appendChild(dl);
            });

            // ---- Resumen ----
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
        .catch((err) => {
            console.error(err);
            alert("No se pudieron cargar los datos del paciente.");
        });

    // --- Eventos ---

    // Reprogramar: abrir modal
    btnReprogramar.addEventListener("click", () => {
        if (cita) {
            document.getElementById("idCita").value = cita.id_cita;
            document.getElementById("fechaNueva").value = cita.fecha_cita;
            document.getElementById("horaNueva").value = cita.hora_inicio
                ? cita.hora_inicio.split(" ")[1].slice(0, 5)
                : "";

            modal.style.display = "flex";
        } else {
            alert("No hay información de la cita para reagendar.");
        }
    });

    // Cerrar modal con la X
    document.getElementById("closeReagendar").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });

    // Enviar formulario de reprogramar
    formReagendar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idCita = document.getElementById("idCita").value;
        const fecha = document.getElementById("fechaNueva").value;
        const hora = document.getElementById("horaNueva").value;

        if (!idCita || !fecha || !hora) {
            alert("Por favor completa todos los campos.");
            return;
        }

        try {
            const resp = await fetch("../BaseDatos/reagendarCita.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_cita: idCita, fecha: fecha, hora: hora })
            });

            const data = await resp.json();
            alert(data.message || "Respuesta sin mensaje");

            if (data.success) {
                modal.style.display = "none";
                location.reload();
            }
        } catch (err) {
            console.error("Error al reagendar:", err);
            alert("Error de red o respuesta inválida.");
        }
    });

    // Cancelar cita
    btnCancelar.addEventListener("click", () => {
        if (!cita || !cita.id_cita) {
            alert("No hay cita para cancelar.");
            return;
        }

        if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
            fetch("../BaseDatos/cancelarCita.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id_cita=${encodeURIComponent(cita.id_cita)}`,
            })
                .then((res) => res.json())
                .then((data) => {
                    alert(data.message);
                    if (data.success) location.reload();
                })
                .catch((err) => {
                    console.error("Error al cancelar:", err);
                    alert("Error al procesar la cancelación.");
                });
        }
    });

    // Agendar nueva cita
    document.getElementById("btnAgendarCita").addEventListener("click", () => {
        window.location.href = "agendarCita.html";
    });
});
