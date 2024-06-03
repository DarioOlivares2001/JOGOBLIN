var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    prodName = document.getElementById("name"),
    prodPrice = document.getElementById("precio"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modal = document.getElementById("userForm"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser");

let getData = [];
let isEdit = false, editId;

newUserBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Guardar';
    modalTitle.innerText = "Llenar Producto";
    isEdit = false;
    imgInput.src = "./image/Profile Icon.webp";
    form.reset();
});

file.onchange = function() {
    if (file.files[0].size < 1000000) {  // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function(e) {
            imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };

        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("¡El archivo es muy grande!");
    }
};

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error('la respuesta de la red no es correcta');
        }
        getData = await response.json();
        showInfo();
    } catch (error) {
        console.error('Error agregando productos:', error);
    }
}

function showInfo() {
    userInfo.innerHTML = '';
    getData.forEach((element, index) => {
        let createElement = `<tr class="productDetails">
            <td><img src="${element.image}" alt="" width="50" height="50"></td>
            <td>${element.nombre}</td>
            <td>${element.precio}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="readInfo('${element.image}', '${element.nombre}', '${element.precio}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye" style="font-size: 0.8rem;"></i></button>
                <button class="btn btn-primary btn-sm" onclick="editInfo(${element.id}, '${element.image}', '${element.nombre}', '${element.precio}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square" style="font-size: 0.8rem;"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteInfo(${element.id})"><i class="bi bi-trash" style="font-size: 0.8rem;"></i></button>
            </td>
        </tr>`;

        userInfo.innerHTML += createElement;
    });
}

function readInfo(pic, nombre, precio) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = nombre;
    document.querySelector("#showAge").value = precio;
}

function editInfo(id, pic, nombre, precio) {
    isEdit = true;
    editId = id;
    imgInput.src = pic;
    prodName.value = nombre;
    prodPrice.value = precio;
    submitBtn.innerText = "Actualizar";
    modalTitle.innerText = "Actualizar Producto";
}

async function deleteInfo(id) {
    if (confirm("¿Estás seguro de querer eliminar este producto?")) {
        try {
            await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE'
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const information = {
        image: imgInput.src == undefined ? "./image/Profile Icon.webp" : imgInput.src,
        nombre: prodName.value,
        precio: prodPrice.value
    };

    try {
        if (!isEdit) {
            await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(information)
            });
        } else {
            await fetch(`http://localhost:3000/products/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(information)
            });
            isEdit = false;
        }
        fetchProducts();
    } catch (error) {
        console.error('Error saving product:', error);
    }

    submitBtn.innerText = "Guardar";
    modalTitle.innerText = "Llenar Producto";

    form.reset();
    imgInput.src = "./image/Profile Icon.webp";
});

fetchProducts();