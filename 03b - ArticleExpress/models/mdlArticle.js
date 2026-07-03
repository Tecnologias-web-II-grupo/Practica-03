var mongoose = require('mongoose');

var schArticle = new mongoose.Schema({
    title : {type: String, required:[true, 'This field is required']},
    description: {type: String, required:[true, 'This field is required']},
    body: {type: String, required:[true, 'This field is required']},
    author: {type: String, required:[true, 'This field is required']},
    comments:[{type: Object,
               properties:{comment:{type: String,required:[true, 'This field is required']},
                           author: {type: String,required:[true, 'This field is required']}},
               required: false}]
});

mongoose.model('Articles', schArticle);
