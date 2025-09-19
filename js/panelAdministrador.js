async function loadUsers(type, containerId, endpoint) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Cargando...</p>';

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(user => {
                const div = document.createElement('div');
                div.classList.add('user-card');

                let nombreCompleto = user.nombres
                    ? `${user.nombres} ${user.apellidos}`
                    : `${user.nombre} ${user.apellido}`;

                div.innerHTML = `
                    <p><strong>${nombreCompleto}</strong></p>
                    <p>${user.email}</p>
                    <p>Estado: ${user.estado}</p>
                    <button onclick="editUser(${user.id_paciente || user.id_usuario}, '${type}')">Editar</button>
                    <button onclick="deleteUser(${user.id_paciente || user.id_usuario}, '${type}')">Eliminar</button>
                `;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<p>No hay registros disponibles.</p>';
        }
    } catch (error) {
        container.innerHTML = '<p>Error al cargar datos.</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addPatientBtn = document.getElementById('add-patient-btn');
    const addTherapistBtn = document.getElementById('add-therapist-btn');

    addPatientBtn.addEventListener('click', () => {
        window.location.href = 'registro.html';
    });

    addTherapistBtn.addEventListener('click', () => {
        window.location.href = 'registroUsuarios.html';
    });

    loadUsers('paciente', 'patients-container', '../BaseDatos/get_pacientes.php');
    loadUsers('terapeuta', 'therapists-container', '../BaseDatos/get_terapeutas.php');
});

function editUser(id, type) {
    window.location.href = `editarUsuario.php?id=${id}&type=${type}`;
}

function deleteUser(id, type) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        fetch(`../BaseDatos/delete_usuario.php?id=${id}&type=${type}`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
    }
}
