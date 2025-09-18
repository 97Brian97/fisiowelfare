document.addEventListener('DOMContentLoaded', () => {
    const agendarCitaForm = document.getElementById('agendar-cita-form');
    const terapeutaSelect = document.getElementById('terapeuta');

    // Fetch and populate therapists
    // This is a placeholder, you will need to implement the backend to fetch the data
    const fetchTherapists = () => {
        // Example data
        const therapists = [
            { id: 1, name: 'Dr. Juan Perez' },
            { id: 2, name: 'Dra. Ana Gomez' },
        ];

        therapists.forEach(therapist => {
            const option = document.createElement('option');
            option.value = therapist.id;
            option.textContent = therapist.name;
            terapeutaSelect.appendChild(option);
        });
    };

    agendarCitaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(agendarCitaForm);
        const cita = {
            terapia: formData.get('terapia'),
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            terapeuta: formData.get('terapeuta'),
            observaciones: formData.get('observaciones'),
        };

        // TODO: Send 'cita' object to the backend to be saved in the database.

        alert('Cita agendada exitosamente (simulación)');
        window.location.href = 'panelPaciente.html';
    });

    fetchTherapists();
});