document.addEventListener('DOMContentLoaded', () => {
    const patientsList = document.getElementById('patients-list');
    const searchBox = document.getElementById('search-box');
    const modal = document.getElementById('patient-modal');
    const closeButton = document.querySelector('.close-button');
    const medicalRecordBtn = document.getElementById('medical-record-btn');

    let patients = [];

    // Cargar pacientes desde PHP
    fetch("../BaseDatos/get_pacientes.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                patients = data.data;
                displayPatients(patients);
            } else {
                patientsList.innerHTML = "<p>Error cargando pacientes.</p>";
            }
        })
        .catch(error => {
            console.error("Error en fetch:", error);
            patientsList.innerHTML = "<p>Error al conectar con el servidor.</p>";
        });

    const displayPatients = (filteredPatients) => {
        patientsList.innerHTML = '';
        filteredPatients.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.className = 'patient-card';
            patientCard.textContent = `${patient.nombres} ${patient.apellidos}`;
            patientCard.addEventListener('click', () => openModal(patient));
            patientsList.appendChild(patientCard);
        });
    };

    const openModal = (patient) => {
        document.getElementById('patient-name').textContent = `${patient.nombres} ${patient.apellidos}`;
        document.getElementById('patient-id').textContent = patient.id_paciente;
        document.getElementById('patient-dni').textContent = `${patient.tipo_documento} ${patient.numero_documento}`;
        document.getElementById('patient-birthdate').textContent = patient.fecha_nacimiento;
        document.getElementById('patient-phone').textContent = patient.telefono;
        document.getElementById('patient-email').textContent = patient.email;
        document.getElementById('patient-address').textContent = patient.direccion;
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
            (patient.nombres + " " + patient.apellidos).toLowerCase().includes(searchTerm)
        );
        displayPatients(filteredPatients);
    });
});
