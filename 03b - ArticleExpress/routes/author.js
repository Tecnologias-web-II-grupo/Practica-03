var express = require('express');
var router = express.Router();

/* GET author listing. */
router.get('/', function(req, res, next) {
  salida = {
    status_code:200,
    status_message: 'Ok',
    data:{
      name: 'Jorge Ruiz',
      nickname: 'York',
      occupation: 'Computer Science Professor',
      year: 2023
    }
  };
  res.set('Content-Type', 'application/json').status(200).send(salida);
});

module.exports = router;
