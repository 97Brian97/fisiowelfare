document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if(!usuario){ window.location.href="../index.html"; return; }

    document.getElementById("bienvenida").textContent = 
        `👋 ¡Bienvenido/a, ${usuario.nombres} ${usuario.apellidos}!`;

    // Fetch de datos del paciente
    fetch(`../BaseDatos/getDatosPaciente.php?id_paciente=${usuario.id}`)
    .then(res=>res.json())
    .then(data=>{
        if(!data.success) throw new Error(data.message);

        // Próxima cita
        const cita = data.proximaCita;
        if(cita){
            document.getElementById("citaTipo").textContent="Próxima cita";
            document.getElementById("citaNombreTratamiento").textContent=cita.observaciones||"-";
            document.getElementById("citaFecha").textContent=cita.fecha_cita;
            document.getElementById("citaHora").textContent=cita.hora_inicio?cita.hora_inicio.split(" ")[1]:"-";
        }

        // Tratamiento activo
        const trat = data.tratamientoActivo;
        if(trat){
            document.getElementById("tratamientoNombre").textContent=trat.nombre_procedimiento;
            document.getElementById("tratamientoSesiones").textContent=`Estado: ${trat.estado}`;
        }

        // Actividad reciente
        const contenedorActividades = document.getElementById("actividadReciente");
        contenedorActividades.innerHTML="";
        data.actividadesRecientes.forEach(act=>{
            const dl=document.createElement("dl");
            dl.innerHTML=`
                <dd>Tratamiento: ${act.nombre_procedimiento||"-"}</dd>
                <dd>Fecha: ${act.fecha_cita}</dd>
                <dd>Estado: ${act.estado}</dd>
            `;
            contenedorActividades.appendChild(dl);
        });

        // Resumen de citas
        const resumen=data.resumen;
        const contenedorResumen=document.getElementById("resumenPaciente");
        contenedorResumen.innerHTML=`
            <dl>
                <dd>Citas atendidas: ${resumen.atendidas||0}</dd>
                <dd>Citas programadas: ${resumen.programadas||0}</dd>
                <dd>Citas canceladas: ${resumen.canceladas||0}</dd>
            </dl>
        `;
    })
    .catch(err=>{ console.error("Error cargando datos:",err); alert("No se pudieron cargar los datos del paciente."); });

    // Botón agendar
    const btnAgendar=document.getElementById("btnAgendarCita");
    btnAgendar.addEventListener("click",()=>{ window.location.href="agendarCita.html"; });

    // Botón cerrar sesión
    const btnCerrar=document.getElementById("btnCerrarSesion");
    btnCerrar.addEventListener("click",()=>{
        localStorage.removeItem("usuario");
        window.location.href="../index.html";
    });

    // Desplegable perfil por click
    const btnPerfil = document.getElementById("btnPerfil");
    const menuPerfil = document.getElementById("menuPerfil");
    btnPerfil.addEventListener("click",()=>{ menuPerfil.classList.toggle("show"); });
    document.addEventListener("click",(e)=>{
        if(!btnPerfil.contains(e.target) && !menuPerfil.contains(e.target)){
            menuPerfil.classList.remove("show");
        }
    });

    // Modo oscuro
    const btnDarkMode=document.getElementById("btnDarkMode");
    btnDarkMode.addEventListener("click",()=>{
        document.body.classList.toggle("dark-mode");
        btnDarkMode.setAttribute("name", document.body.classList.contains("dark-mode")?"moon-outline":"contrast-outline");
    });
});
