document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    const carro = JSON.parse(localStorage.getItem('carro'));

    if (usuario) {
        document.getElementById('usuario-nombre').innerText = usuario.username;
        document.getElementById('usuario-email').innerText = usuario.email;
    }

    let total = 0;
    const facturaProductos = document.getElementById('factura-productos');

    fetch('../productos.json')
        .then(response => response.json())
        .then(productos => {
            if (carro) {
                carro.forEach(item => {
                    const producto = productos.find(p => p.id == item.id_producto);
                    if (producto) {
                        const precioTotal = producto.precio * item.cantidad;
                        total += precioTotal;

                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${producto.nombre}</td>
                            <td>${item.cantidad}</td>
                            <td>$${producto.precio}</td>
                            <td>$${precioTotal}</td>
                        `;
                        facturaProductos.appendChild(row);
                    }
                });

                document.getElementById('factura-total').innerText = total;
                localStorage.removeItem('carro');
            }
        });
});

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