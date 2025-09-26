document.addEventListener("DOMContentLoaded", () => {
    const tipoConsultaSelect = document.getElementById("tipo_consulta");
    const terapiaSelect = document.getElementById("terapia");
    const terapeutaSelect = document.getElementById("terapeuta");
    const form = document.getElementById("agendar-cita-form");

    // ✅ Opciones de terapias reales
    const terapias = {
        "primera_vez": ["Evaluación Inicial"],
        "fisioterapia_convencional": [
            "Terapia Física",
            "Masajes Terapéuticos y Deportivos",
            "Ultrasonido",
            "Kinesiotape",
            "Electropunción",
            "Cupping (Ventosas)",
            "Ejercicio Terapéutico",
            "Descarga Muscular para Deportistas",
            "Terapia Manual e Instrumental",
            "Quiropraxia",
            "Osteoterapia"
        ],
        "fisioterapia_invasiva": [
            "Sueroterapia",
            "Plasma Rico en Plaquetas",
            "Terapia Neural",
            "Punción Seca",
            "Masajes Reductores",
            "Reafirmantes (Abdomen y Glúteos)",
            "Maderoterapia",
            "Limpieza e Hidratación Facial"
        ]
    };

    // Cambiar terapias dinámicamente
    tipoConsultaSelect.addEventListener("change", () => {
        const tipo = tipoConsultaSelect.value;
        terapiaSelect.innerHTML = '<option value="">Seleccione una terapia</option>';

        if (terapias[tipo]) {
            terapias[tipo].forEach(t => {
                const option = document.createElement("option");
                option.value = t;
                option.textContent = t;
                terapiaSelect.appendChild(option);
            });
        }
    });

    // Cargar lista de terapeutas desde la BD
    fetch("../BaseDatos/get_terapeutas_citas.php")
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de terapeutas:", data);

            // Limpiar opciones previas
            terapeutaSelect.innerHTML = '<option value="">Seleccione un terapeuta</option>';

            if (data.success) {
                data.terapeutas.forEach(terapeuta => {
                    const option = document.createElement("option");
                    option.value = terapeuta.id_terapeuta;
                    option.textContent = terapeuta.nombre;
                    terapeutaSelect.appendChild(option);
                });
            } else {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "No hay terapeutas disponibles";
                terapeutaSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Error cargando terapeutas:", error);
            terapeutaSelect.innerHTML =
                '<option value="">Error al cargar terapeutas</option>';
        });

    // Enviar formulario con confirmación
    form.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(form);

        // Armar un resumen para confirmar
        const resumen = `
            📅 Fecha: ${formData.get("fecha")}
            ⏰ Hora: ${formData.get("hora")}
            👨‍⚕️ Terapeuta: ${terapeutaSelect.options[terapeutaSelect.selectedIndex].text}
            📝 Tipo de consulta: ${formData.get("tipo_consulta")}
            💆‍♂️ Terapia: ${formData.get("terapia")}
            ✍️ Observaciones: ${formData.get("observaciones") || "Ninguna"}
            `;

        if (!confirm("Por favor verifique su cita:\n\n" + resumen)) {
            return; // Si el paciente cancela, no se envía nada
        }

        // Si confirma, enviar al servidor
        fetch("../BaseDatos/agendarCita.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("✅ Cita agendada con éxito.");
                    form.reset();
                } else {
                    alert("❌ Error: " + data.message);
                }
            })
            .catch(err => console.error("Error al agendar cita:", err));
    });

});
