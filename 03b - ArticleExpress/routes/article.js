var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Article = mongoose.model('Articles');

// Retrieves all registered articles
router.get('/', function (req,res){
   Article.find({},[],(err,articles) =>{
       if(articles.length === 0){
           articles = {'articles': 'List is empty'}
       }
       salida = {
           status_code:200,
           status_message: 'Ok',
           data: articles
       };
       res.set('Content-Type', 'application/json').status(200).send(salida);
   })
});

// Retrieve only one article by id
router.get('/:id', function (req,res){
    Article.find({_id:req.params.id},[],(err,articles) =>{
        if(articles.length === 0){
            articles = {'articles': 'List is empty'}
        }
        salida = {
            status_code:200,
            status_message: 'Ok',
            data: articles
        };
        res.set('Content-Type', 'application/json').status(200).send(salida);
    })
});

// Insert article without comments
router.post('/', function(req, res, next) {
    var newArticle = req.body;
    var arti = new Article();

    arti.title = newArticle.title;
    arti.description = newArticle.description;
    arti.body = newArticle.body;
    arti.author = newArticle.author;

    arti.save().then(()=>{
        salida = {
            status_code:201,
            status_message: 'Data was created',
            data: arti
        };
        res.set('Content-Type', 'application/json').status(201).send(salida);
    }).catch(next);
});

// Update one article by id, without comments
router.put('/', function(req, res, next) {
    Article.updateOne({_id:req.body.id},
        {$set:{title:req.body.title,
                     description:req.body.description,
                     body:req.body.body,
                     author:req.body.author}}).then(()=>{
        salida = {
            status_code:200,
            status_message: 'Ok',
            data: 'Record updated'
        };
        res.set('Content-Type', 'application/json').status(200).send(salida);
    }).catch(next);
});

// Delete one article by id
router.delete('/', function(req, res, next) {
    Article.deleteOne({_id:req.body.id}).then(()=>{
        salida = {
            status_code:200,
            status_message: 'Ok',
            data: 'Record deleted'
        };
        res.set('Content-Type', 'application/json').status(200).send(salida);
    }).catch(next);
});

module.exports = router;
