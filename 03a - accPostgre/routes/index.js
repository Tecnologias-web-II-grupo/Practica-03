var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    salida = {
        status_code:200,
        status_message: 'Ok',
        data:{
            title: 'API-Rest Demo....!',
            description: 'An example to access and register data into PostgreSQL Engine.'
        }
    };
    res.set('Content-Type', 'application/json').status(200).send(salida);
});

module.exports = router;
