var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Categories');
const multer = require('multer');
const fs = require('node:fs');

const subir = multer({ dest: 'subirfoto/' });

function getBase64Image(filePath) {
    const image = fs.readFileSync(filePath);
    return Buffer.from(image).toString('base64');
}

router.post('/', subir.single('image'), async function (req, res) {
    try {
        const { CategoryID, CategoryName, Description } = req.body;
        var imagen = getBase64Image(req.file.path);
        var mime = req.file.mimetype;

        const nuevaCategoria = new Category({
            CategoryID: CategoryID,
            CategoryName: CategoryName,
            Description: Description,
            Image: imagen,
            Mime: mime
        });

        const resultado = await nuevaCategoria.save();
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            status_code: 200,
            status_message: 'OK',
            content: resultado
        });
    } catch (error) {
        res.status(500).json({
            status_code: 500,
            status_message: 'Internal Server Error',
            content: { error: error.toString() }
        });
    }
});

router.get('/', async function (req, res) {
    try {
        const resultado = await Category.find();
        res.status(200).json({
            status_code: 200,
            status_message: 'OK',
            content: resultado
        });
    } catch (error) {
        res.status(500).json({
            status_code: 500,
            status_message: 'Internal Server Error',
            content: { error: error.toString() }
        });
    }
});

router.get('/:id/foto', async function (req, res) {
    try {
        const categoria = await Category.findOne({ CategoryID: req.params.id });
        if (!categoria) {
            return res.status(404).json({ status_code: 404, status_message: 'Not Found' });
        }

        const image = Buffer.from(categoria.Image, 'base64');
        res.writeHead(200, {
            'Content-Type': categoria.Mime,
            'Content-Length': image.length
        });
        res.end(image);
    } catch (error) {
        res.status(500).json({
            status_code: 500,
            status_message: 'Internal Server Error',
            content: { error: error.toString() }
        });
    }
});

module.exports = router;
