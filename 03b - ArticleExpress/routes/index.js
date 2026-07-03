var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  salida = {
    status_code:200,
    status_message: 'Ok',
    data:{
      title: 'Express articles....!',
      description: 'An example to register text like as newspaper articles'
    }
  };
  res.set('Content-Type', 'application/json').status(200).send(salida);
});

module.exports = router;
