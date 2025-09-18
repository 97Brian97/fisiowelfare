document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idPaciente = urlParams.get('id_paciente');

    if (!idPaciente) {
        document.querySelector('main').innerHTML =
            '<p>No se ha seleccionado ningún paciente. Por favor, vuelva a la lista de pacientes.</p>';
        return;
    }

    fetch(`../BaseDatos/get_historia.php?id_paciente=${idPaciente}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const patient = data.paciente;
                const historia = data.historia;
                const progresiones = data.progresiones;

                document.getElementById('patient-name').textContent = patient.nombre;
                document.getElementById('patient-id').textContent = patient.id_paciente;
                document.getElementById('patient-dni').textContent = patient.dni;

                if (!historia) {
                    // No hay historia → mostrar formulario
                    document.getElementById('clinical-history').style.display = "none";
                    document.getElementById('progressions').style.display = "none";
                    document.getElementById('new-history-form').style.display = "block";

                    const form = document.getElementById('create-history-form');
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();

                        const formData = new FormData(form);
                        formData.append("id_paciente", patient.id_paciente);

                        fetch("../BaseDatos/create_historia.php", {
                            method: "POST",
                            body: formData
                        })
                            .then(res => res.json())
                            .then(resp => {
                                if (resp.success) {
                                    alert("Historia clínica creada con éxito");
                                    window.location.reload(); // recargar página para mostrar historia
                                } else {
                                    alert("Error: " + resp.message);
                                }
                            });
                    });

                } else {
                    // Ya existe historia
                    document.getElementById('history-summary').textContent =
                        historia?.motivo_consulta || "Sin información";

                    const progressionsList = document.getElementById('progressions-list');
                    const renderProgressions = () => {
                        progressionsList.innerHTML = '';
                        progresiones.forEach(prog => {
                            const item = document.createElement('div');
                            item.className = 'progression-item';
                            item.innerHTML = `<p><strong>${prog.fecha}:</strong> ${prog.texto}</p>`;
                            progressionsList.appendChild(item);
                        });
                    };
                    renderProgressions();

                    const addForm = document.getElementById('add-progression-form');
                    addForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const texto = document.getElementById('progression-text').value;

                        fetch('../BaseDatos/add_progresion.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_historia: historia.id_historia,
                                texto: texto
                            })
                        })
                            .then(res => res.json())
                            .then(resp => {
                                if (resp.success) {
                                    progresiones.push({
                                        fecha: resp.fecha,
                                        texto: texto
                                    });
                                    renderProgressions();
                                    addForm.reset();
                                } else {
                                    alert("Error al guardar progresión: " + resp.message);
                                }
                            });
                    });
                }
            }
        })
        .catch(err => {
            console.error(err);
            document.querySelector('main').innerHTML =
                '<p>Error de conexión con el servidor.</p>';
        });
});
