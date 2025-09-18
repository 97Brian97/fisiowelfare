document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('contrasena');
    const confirmPasswordInput = document.getElementById('confirmar-contrasena');
    const lengthCheck = document.getElementById('length-check');
    const upperCheck = document.getElementById('upper-check');
    const numberCheck = document.getElementById('number-check');
    const toggleIcons = document.querySelectorAll('.toggle-password');

    // Validación en tiempo real
    passwordInput.addEventListener('keyup', function () {
        const password = passwordInput.value;
        lengthCheck.classList.toggle('valid', password.length >= 8);
        upperCheck.classList.toggle('valid', /[A-Z]/.test(password));
        numberCheck.classList.toggle('valid', /\d/.test(password));
    });

    // Mostrar/ocultar contraseña
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Enviar formulario
    const form = document.getElementById("registroForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            alert("❌ La contraseña no cumple los requisitos.");
            return;
        }
        if (password !== confirmPassword) {
            alert("❌ Las contraseñas no coinciden.");
            return;
        }

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        delete data["confirmar-contrasena"];

        try {
            const response = await fetch("../BaseDatos/registroUsuarios.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Registro exitoso. Bienvenido, " + data["nombre"]);
                window.location.href = result.redirect;
            } else {
                alert("❌ Error: " + result.message);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("⚠️ Ocurrió un error en la conexión con el servidor.");
        }
    });
});
