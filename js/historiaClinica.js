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
                const evoluciones = data.evoluciones; // ✅ cambiado

                document.getElementById('patient-name').textContent = patient.nombre;
                document.getElementById('patient-id').textContent = patient.id_paciente;
                document.getElementById('patient-dni').textContent = patient.dni;

                if (!historia) {
                    // No hay historia → mostrar formulario
                    document.getElementById('clinical-history').style.display = "none";
                    document.getElementById('evolutions').style.display = "none"; // ✅ cambiado
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

                    const evolutionsList = document.getElementById('evolutions-list'); // ✅ cambiado
                    const renderEvolutions = () => {
                        evolutionsList.innerHTML = '';
                        evoluciones.forEach(evo => {
                            const item = document.createElement('div');
                            item.className = 'evolution-item'; // ✅ cambiado
                            item.innerHTML = `<p><strong>${evo.fecha}:</strong> ${evo.texto}</p>`;
                            evolutionsList.appendChild(item);
                        });
                    };
                    renderEvolutions();

                    const addForm = document.getElementById('add-evolution-form'); // ✅ cambiado
                    addForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const texto = document.getElementById('evolution-text').value; // ✅ cambiado

                        fetch('../BaseDatos/add_evolucion.php', { // ✅ cambiado
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
                                    evoluciones.push({
                                        fecha: resp.fecha,
                                        texto: texto
                                    });
                                    renderEvolutions();
                                    addForm.reset();
                                } else {
                                    alert("Error al guardar evolución: " + resp.message);
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
