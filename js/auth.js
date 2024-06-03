let iconoCarro = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let cerrarCarro = document.querySelector('.cerrar');
let listarCarroHTML = document.querySelector('.listarCarro');
let iconCarroHTML = document.querySelector('.icon-cart span');

let products = [];
let carro = [];

let productos = [];

iconoCarro.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})

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
    fetch('../productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        agregarDatosAlHTML();

        if(localStorage.getItem('carro')){
            carro = JSON.parse(localStorage.getItem('carro'));
            agregarCarroHTML();
        }

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        
        const userMenu = document.getElementById('userMenu');
        const userNavItem = document.getElementById('userNavItem');
        
        if (usuarioActivo) {
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
            if (userMenu) {
                userMenu.style.display = 'block';
            }
            if (userNavItem) {
                userNavItem.style.display = 'none';
            }
        }


        const cerrarSesionBtn = document.getElementById('cerrarSesion');
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', () => {
                localStorage.removeItem('usuarioActivo');
                location.reload();
            });
        }
    });
};

initApp();

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.email === email);

    
    if (user && user.password === password) {
        alert('Inicio de sesión exitoso ' + user.username);
        localStorage.setItem('usuarioActivo', JSON.stringify(user));
        if(user.username == 'admin'){
            window.location.href = 'adminproductos.html';
        }else
        {
            window.location.href = 'index.html';
        }

        
    } else {
        alert('Correo electrónico o contraseña incorrectos');
    }
});


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

    window.location.href = 'login.html';
});

function validateUsername(username) {
    return username.length >= 3;
}

function validateEmail(email) {
    let re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

