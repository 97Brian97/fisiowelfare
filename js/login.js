document.addEventListener('DOMContentLoaded', function () {
    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            numero_documento: document.getElementById("numero_documento").value.trim(),
            contrasena: document.getElementById("contrasena").value
        };

        try {
            const response = await fetch("../BaseDatos/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert("Bienvenido " + result.usuario.nombres + " " + result.usuario.apellidos);
                localStorage.setItem("usuario", JSON.stringify(result.usuario));
                window.location.href = result.redirect;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error al iniciar sesión. Intenta de nuevo.");
        }
    });
});
