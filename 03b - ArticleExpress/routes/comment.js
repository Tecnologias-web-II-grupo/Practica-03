var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Article = mongoose.model('Articles');

// Simulate a post process, applying update registered article, adding a new comment
router.post('/', function(req, res, next) {
    Article.updateOne({_id:req.body.id},
        {$push:{comments:{comment:req.body.comment,
                                author:req.body.author}}}).then(()=>{
        salida = {
            status_code:201,
            status_message: 'Data was created',
            data: 'Comments added into article'
        };
        res.set('Content-Type', 'application/json').status(201).send(salida);
    }).catch(next);
});

module.exports = router;
