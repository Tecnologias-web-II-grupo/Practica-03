var mongoose = require('mongoose');

var schCategory = new mongoose.Schema({
    CategoryID: { type: Number, required: [true, 'This field is required'] },
    CategoryName: { type: String, required: [true, 'This field is required'] },
    Description: { type: String, required: false },
    Image: { type: String, required: false },
    Mime: { type: String, required: false }
});

mongoose.model('Categories', schCategory);
