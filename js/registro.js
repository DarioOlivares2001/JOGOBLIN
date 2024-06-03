let iconoCarro = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let cerrarCarro = document.querySelector('.cerrar');
let listarCarroHTML = document.querySelector('.listarCarro');
let iconCarroHTML = document.querySelector('.icon-cart span');

let products = [];
let carro = [];

let productos = [];

//mostrar carro pinchando el icono carro
iconoCarro.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})

//ocultar el carro presionando el boton cerrar
cerrarCarro.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})


const agregarAlCarro = (id_producto) => {
    let posicionProdEnCarro = carro.findIndex((value) => value.id_producto == id_producto);
    if(carro.length <= 0){
        carro = [{
            id_producto : id_producto,
            cantidad : 1
        }]
    }else if(posicionProdEnCarro < 0){
        carro.push({
            id_producto : id_producto,
            cantidad : 1
        })

    }else {
        carro[posicionProdEnCarro].cantidad = carro[posicionProdEnCarro].cantidad + 1;
    }
    console.log(carro)
    agregarCarroHTML();
    agregarCarroEnMemoria();
}

const agregarCarroEnMemoria = () => {
    localStorage.setItem('carro', JSON.stringify(carro));
}

const agregarCarroHTML = () => {
    listarCarroHTML.innerHTML = '';
    let cantidadTotal = 0;
    if(carro.length > 0){
        carro.forEach(item => {
            cantidadTotal = cantidadTotal + item.cantidad
            let nuevoItem = document.createElement('div');
            nuevoItem.classList.add('item');
            nuevoItem.dataset.id = item.id_producto;
            let posicionProducto = productos.findIndex((value) => value.id == item.id_producto);
            let info = productos[posicionProducto];
            //console.log(info.id_producto);
            listarCarroHTML.appendChild(nuevoItem);
            nuevoItem.innerHTML = `
            <div class="image">
            <img src="${info.image}">
            </div>
            <div class="name">
            ${info.nombre}
            </div>
            <div class="precioTotal">$${info.precio * item.cantidad}</div>
            <div class="cantidad">
                <span class="menos"><</span>
                <span>${item.cantidad}</span>
                <span class="mas">></span>
            </div>
            `;

        })
    }
    iconCarroHTML.innerText = cantidadTotal;
}


listarCarroHTML.addEventListener('click', (event) =>{
    let posicionClick = event.target;
    if(posicionClick.classList.contains('menos') || posicionClick.classList.contains('mas')){
        let id_producto = posicionClick.parentElement.parentElement.dataset.id;
        let type = 'menos';
        if(posicionClick.classList.contains('mas')){
            type = 'mas'
        }
        cambiarCantidadCarro(id_producto, type);

    }
        
})


const cambiarCantidadCarro = (id_producto, type) => {
    let posicionItemEnCarro = carro.findIndex((value) => value.id_producto == id_producto);
    if(posicionItemEnCarro >= 0){
        let info = carro[posicionItemEnCarro];
        switch(type){
            case 'mas':
                carro[posicionItemEnCarro].cantidad = carro[posicionItemEnCarro].cantidad + 1;
                break;
        
            default:
                let cambiarCantidad = carro[posicionItemEnCarro].cantidad - 1;
                if (cambiarCantidad > 0) {
                    carro[posicionItemEnCarro].cantidad = cambiarCantidad;
                }else{
                    carro.splice(posicionItemEnCarro, 1);
                }
                break;
        }
    }
    agregarCarroHTML();
    agregarCarroEnMemoria();
}

const initApp = () => {
    // obtener data de json de productos
    fetch('../productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        agregarDatosAlHTML();

        //tomar los datos de la memoria
        if(localStorage.getItem('carro')){
            carro = JSON.parse(localStorage.getItem('carro'));
            agregarCarroHTML();
        }

        // Obtener el usuario activo del almacenamiento local
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        
        const userMenu = document.getElementById('userMenu');
        const userNavItem = document.getElementById('userNavItem');
        
        if (usuarioActivo) {
            // Si hay un usuario activo, muestra el menú de usuario y oculta el de login/registro
            if (userMenu) {
                userMenu.style.display = 'none';
            }
            if (userNavItem) {
                userNavItem.style.display = 'block';
                const navLink = userNavItem.querySelector('.nav-link');
                if (navLink) {
                    navLink.textContent = usuarioActivo.username;
                }
            }
        } else {
            // Si no hay un usuario activo, muestra el menú de login/registro y oculta el de usuario
            if (userMenu) {
                userMenu.style.display = 'block';
            }
            if (userNavItem) {
                userNavItem.style.display = 'none';
            }
        }


        // Agregar event listener al botón "Cerrar Sesión"
        const cerrarSesionBtn = document.getElementById('cerrarSesion');
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', () => {
                // Eliminar usuario activo del almacenamiento local
                localStorage.removeItem('usuarioActivo');
                // Recargar la página
                location.reload();
            });
        }
    });
};

initApp();


// Función para validar el nombre de usuario
function validateUsername(username) {
    return username.length >= 3;
}

// Función para validar el correo electrónico
function validateEmail(email) {
    let re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
}

// Función para validar la contraseña
function validatePassword(password) {
    return password.length >= 6;
}


// Validación del formulario de registro
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (!validateUsername(username)) {
        alert('El nombre de usuario debe tener al menos 3 caracteres.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Por favor ingrese un correo electrónico válido.');
        return;
    }

    if (!validatePassword(password)) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('El correo electrónico ya está registrado.');
        return;
    }

    let newUser = {
        username: username,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');

    // Redirigir a la página de login
    window.location.href = 'login.html';
});


