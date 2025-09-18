document.addEventListener('DOMContentLoaded', () => {
    // This is a placeholder for patient data. In a real application, you would fetch this from a database.
    const patients = [
        {
            id: 1, name: 'Juan Perez', dni: '12345678A', birthdate: '1990-01-01', phone: '123-456-789', 
            email: 'juan.perez@example.com', address: 'Calle Falsa 123',
            clinical_history: { summary: 'Paciente con dolor lumbar crónico.' },
            progressions: [ { date: '2023-10-27', text: 'El paciente reporta una leve mejoría.' } ]
        },
        {
            id: 2, name: 'Ana Gomez', dni: '87654321B', birthdate: '1985-05-10', phone: '987-654-321',
            email: 'ana.gomez@example.com', address: 'Avenida Siempreviva 742',
            clinical_history: { summary: 'Esguince de tobillo en proceso de rehabilitación.' },
            progressions: []
        },
    ];

    const patientsList = document.getElementById('patients-list');
    const searchBox = document.getElementById('search-box');
    const modal = document.getElementById('patient-modal');
    const closeButton = document.querySelector('.close-button');
    const medicalRecordBtn = document.getElementById('medical-record-btn');

    const displayPatients = (filteredPatients) => {
        patientsList.innerHTML = '';
        filteredPatients.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.className = 'patient-card';
            patientCard.textContent = patient.name;
            patientCard.addEventListener('click', () => openModal(patient));
            patientsList.appendChild(patientCard);
        });
    };

    const openModal = (patient) => {
        document.getElementById('patient-name').textContent = patient.name;
        document.getElementById('patient-id').textContent = patient.id;
        document.getElementById('patient-dni').textContent = patient.dni;
        document.getElementById('patient-birthdate').textContent = patient.birthdate;
        document.getElementById('patient-phone').textContent = patient.phone;
        document.getElementById('patient-email').textContent = patient.email;
        document.getElementById('patient-address').textContent = patient.address;
        modal.style.display = 'block';

        medicalRecordBtn.onclick = () => {
            localStorage.setItem('selectedPatient', JSON.stringify(patient));
            window.location.href = 'historiaClinica.html';
        };
    };

    closeButton.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPatients = patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm)
        );
        displayPatients(filteredPatients);
    });

    displayPatients(patients);
});