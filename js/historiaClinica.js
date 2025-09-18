document.addEventListener('DOMContentLoaded', () => {
    const patient = JSON.parse(localStorage.getItem('selectedPatient'));

    if (patient) {
        document.getElementById('patient-name').textContent = patient.name;
        document.getElementById('patient-id').textContent = patient.id;
        document.getElementById('patient-dni').textContent = patient.dni;
        document.getElementById('history-summary').textContent = patient.clinical_history.summary;

        const progressionsList = document.getElementById('progressions-list');
        const displayProgressions = () => {
            progressionsList.innerHTML = '';
            patient.progressions.forEach(prog => {
                const progressionItem = document.createElement('div');
                progressionItem.className = 'progression-item';
                progressionItem.innerHTML = `<p><strong>${prog.date}:</strong> ${prog.text}</p>`;
                progressionsList.appendChild(progressionItem);
            });
        };

        const addProgressionForm = document.getElementById('add-progression-form');
        addProgressionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const progressionText = document.getElementById('progression-text').value;
            const newProgression = {
                date: new Date().toISOString().split('T')[0],
                text: progressionText,
            };
            patient.progressions.push(newProgression);
            // In a real application, you would save this to the database.
            localStorage.setItem('selectedPatient', JSON.stringify(patient)); 
            displayProgressions();
            addProgressionForm.reset();
        });

        displayProgressions();
    } else {
        // Handle case where no patient is selected
        document.querySelector('main').innerHTML = '<p>No se ha seleccionado ningún paciente. Por favor, vuelva a la lista de pacientes.</p>';
    }
});