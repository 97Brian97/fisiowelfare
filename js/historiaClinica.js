document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del paciente desde la URL (?id_paciente=...)
    const urlParams = new URLSearchParams(window.location.search);
    const idPaciente = urlParams.get('id_paciente');

    if (!idPaciente) {
        document.querySelector('main').innerHTML =
            '<p>No se ha seleccionado ningún paciente. Por favor, vuelva a la lista de pacientes.</p>';
        return;
    }

    // 1. Cargar la historia clínica desde PHP
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
                document.getElementById('history-summary').textContent = historia?.motivo_consulta || "Sin información";

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

                // 2. Añadir nueva progresión
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

            } else {
                document.querySelector('main').innerHTML =
                    '<p>Error al cargar historia clínica. Por favor, intente de nuevo.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            document.querySelector('main').innerHTML =
                '<p>Error de conexión con el servidor.</p>';
        });
});
