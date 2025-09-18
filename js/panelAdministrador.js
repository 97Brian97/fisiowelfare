document.addEventListener('DOMContentLoaded', () => {
    const addPatientBtn = document.getElementById('add-patient-btn');
    const addTherapistBtn = document.getElementById('add-therapist-btn');

    addPatientBtn.addEventListener('click', () => {
        window.location.href = 'registro.html';
    });

    addTherapistBtn.addEventListener('click', () => {
        window.location.href = 'registroUsuarios.html';
    });

    // Fetch and display patients
    // This is a placeholder, you will need to implement the backend to fetch the data
    const patientsContainer = document.getElementById('patients-container');
    patientsContainer.innerHTML = '<p>Cargando pacientes...</p>';

    // Fetch and display therapists
    // This is a placeholder, you will need to implement the backend to fetch the data
    const therapistsContainer = document.getElementById('therapists-container');
    therapistsContainer.innerHTML = '<p>Cargando terapeutas...</p>';
});