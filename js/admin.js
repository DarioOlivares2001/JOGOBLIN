document.addEventListener('DOMContentLoaded', function() {
    const adminContent = document.getElementById('adminContent');
    const productosLink = document.getElementById('productosLink');
    const usuariosLink = document.getElementById('usuariosLink');

    productosLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadProductos();
    });

    usuariosLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadUsuarios();
    });

    function loadProductos() {
        fetch('productos.json')
            .then(response => response.json())
            .then(productos => {
                adminContent.innerHTML = '<h2>Productos</h2><div class="row">';
                productos.forEach(producto => {
                    adminContent.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <img src="${producto.image}" class="card-img-top" alt="${producto.nombre}">
                                <div class="card-body">
                                    <h5 class="card-title">${producto.nombre}</h5>
                                    <p class="card-text">Precio: $${producto.precio}</p>
                                    <button class="btn btn-primary" onclick="editProducto(${producto.id})">Editar</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                adminContent.innerHTML += '</div>';
            })
            .catch(error => console.error('Error cargando productos:', error));
    }

    function loadUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        adminContent.innerHTML = '<h2>Usuarios</h2><div class="row">';
        usuarios.forEach(usuario => {
            adminContent.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${usuario.username}</h5>
                            <p class="card-text">Email: ${usuario.email}</p>
                            <button class="btn btn-primary" onclick="editUsuario(${usuario.id})">Editar</button>
                        </div>
                    </div>
                </div>
            `;
        });
        adminContent.innerHTML += '</div>';
    }

    window.editProducto = function(id) {
       alert('Editar producto con ID: ' + id);
    }

    window.editUsuario = function(id) {
        alert('Editar usuario con ID: ' + id);
    }
});

loadProductos();