// call external libraries
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const fs = require('node:fs');
const { Pool } = require('pg');
require('dotenv').config();

// create a middleware to upload files
const multer = require("multer");
const subir = multer({ dest: "subirfoto/" });

// create an instance of express
const app = express();
const port = 5000;

// create a pool of connections to the database
const pool = new Pool({
    host: process.env.HOST,
    database: process.env.DBAS,
    user: process.env.USER,
    password: process.env.PASS,
    port: 5432,
});

// Use CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// create listener for GET requests to the root URL
app.get('/', (req, res) => {
    salida = {
        status_code: 200,
        status_message: 'OK',
        content: {
            mensaje: 'Hola Mundo',
            autor: 'Jorge Ruiz (york)',
            fecha: new Date()
        }
    }
    res.status(200).json(salida);
});

// function to convert image to Base64
function getBase64Image(filePath) {
    const image = fs.readFileSync(filePath);
    return Buffer.from(image).toString('base64');
}

app.get('/imagenes/:id', async function obtenerImagenes(req, res) {
    // create the query
    const query = 'SELECT * FROM principal.tb_imagenes where id = $1';
    const id  = req.params.id;
    const values = [id];

    // execute the query
    try {
        const result = await pool.query(query, values);
        salida = {
            status_code: 200,
            status_message: 'OK',
            content: {
                resultado: result.rows
            }
        }
        res.status(200).json(salida);
    } catch (error) {
        salida = {
            status_code: 500,
            status_message: 'Internal Server Error',
            content: {
                error: error.toString()
            }
        }
        res.status(500).json(salida);
    }
});

app.get('/foto/:id', async function obtenerImagenes(req, res) {
    // create the query
    const query = 'SELECT imagen, mime FROM principal.tb_imagenes where id = $1';
    const id  = req.params.id;
    const values = [id];

    // execute the query
    try {
        encontro = false;
        const result = await pool.query(query, values);
        result.rows.forEach(row => {
            const image = Buffer.from(row.imagen, 'base64');
            res.writeHead(200, {
                'Content-Type': row.mime,
                'Content-Length': image.length
            });
            encontro = true;
            res.end(image);
        });
    } catch (error) {
        salida = {
            status_code: 500,
            status_message: 'Internal Server Error',
            content: {
                error: error.toString()
            }
        }
        res.status(500).json(salida);
    }
});

// create listener for POST requests to the /imagenes URL
app.post('/imagenes', subir.array("imagen", 1), async function subirFoto(req, res) {
    try {
        // get the values from the request body
        const { id, nombre } = req.body;
        var imagen = getBase64Image(req.files[0].path);
        var mime = req.files[0].mimetype;

        // create the query and values
        const query = 'INSERT INTO principal.tb_imagenes (id, nombre, imagen, mime) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [id, nombre, imagen, mime];
        const result = await pool.query(query, values);

        salida = {
            status_code: 200,
            status_message: 'OK',
            content: {
                resultado: result
            }
        }
        // delete the file
        fs.unlinkSync(req.files[0].path);

        // return the result
        res.status(200).json(salida);
    } catch (error) {
        salida = {
            status_code: 500,
            status_message: 'Internal Server Error',
            content: {
                error: error.toString()
            }
        }
        // delete the file
        fs.unlinkSync(req.files[0].path);

        // return the error
        res.status(500).json(salida);
    }
});

// run server
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
