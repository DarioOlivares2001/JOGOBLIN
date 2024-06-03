const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
const dataFilePath = path.join(__dirname, 'productos.json');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get('/products', (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error leyendo el archivo');
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.post('/products', (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error al leer archivo');
            return;
        }
        const products = JSON.parse(data);
        const newProduct = req.body;
        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(newProduct);

        fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error escribiendo archivo');
                return;
            }
            res.send(newProduct);
        });
    });
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error leyendo el archivo');
            return;
        }
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            res.status(404).send('Producto no encontrado');
            return;
        }

        products[productIndex] = { ...products[productIndex], ...req.body };

        fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error escribiendo archivo');
                return;
            }
            res.send(products[productIndex]);
        });
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error leyendo el archivo');
            return;
        }
        let products = JSON.parse(data);
        products = products.filter(p => p.id !== productId);

        fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error escribiendo el archivo');
                return;
            }
            res.send({ id: productId });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});