var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'dbCategories' });

require('./models/mdlCategory');

var categoryRouter = require('./routes/category');
app.use('/category', categoryRouter);

var server = app.listen(5006, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});