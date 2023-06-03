window.onload = init;

function init() {
    if (!localStorage.getItem("token")){
        document.querySelector('.btn-primary').addEventListener('click', login);
    }else{
        window.location.href= "lobby.html";
    }
}

function login() {
    var nombre = document.getElementById('input-nombre').value;
    var correo = document.getElementById('input-correo').value;

    axios({
        method: 'post',
        url: 'http://localhost:3000/empleados/login',
        data: {
            nombre: nombre,
            correo: correo
        }
    }).then(function(res) {
        if(res.data.code === 200){
            localStorage.setItem("token", res.data.message);
            window.location.href = "lobby.html";
        }else{
            alert("Usuario y/o contraseña incorrectos");
        }
    }).catch(function(err) {
        console.log(err);
    })
}