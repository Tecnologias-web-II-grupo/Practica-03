var express = require('express');
var router = express.Router();
var pool = require('../utils/conex');

// Retrieves all registered users
router.get('/', function (req, res){
    pool.query('select * from users order by id asc', (error, results) => {
        if (error) {
            throw error
        }
        salida = {
            "status_code": 200,
            "status_message": "OK",
            "data": results.rows}
        res.status(200).json(salida)
    })
});

router.get('/:id', function (req, res){
    const id = parseInt(req.params.id)

    pool.query('select * from users where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        salida = {
            "status_code": 200,
            "status_message": "OK",
            "data": results.rows}
        res.status(200).json(salida)
    })
});

router.post('/', function(req, res, next) {
    const { name, email } = req.body

    pool.query('insert into users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        salida = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": "User added successfully"}
        res.status(201).send(salida);
    })
});

router.put('/', function(req, res, next) {
    const {id, name, email } = req.body

    pool.query(
        'update users set name = $1, email = $2 where id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            salida = {
                "status_code": 200,
                "status_message": "Ok",
                "data": "User modified successfully"}
            res.status(200).send(salida)
        }
    )
});

router.delete('/', function(req, res, next) {
    const {id} = req.body

    pool.query('delete from users where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        salida = {
            "status_code": 200,
            "status_message": "Ok",
            "data": "User deleted successfully"}
        res.status(200).send(salida)
    })
});

module.exports = router
