// Load libraries into the environment application
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// Creates application
var app = express();

app.use(cors());

// Application parser to support JSON data format
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Creates connection with MongoDB for myself into the local environment
mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'dbArticles' });

/*async function connect() {
    await mongoose.connect('mongodb+srv://doadmin:T7823w9xqz4kf60h@db-mongodb-nyc1-21875-4e032A45.mongo.ondigitalocean.com/',
        {dbName: 'dbArticles',
                useNewUrlParser: true,
                useUnifiedTopology: true},error => error ? console.log(error) : console.log('Connected to MongoDB'));
}
connect().catch(error => console.log(error));*/

require('./models/mdlArticle');
require('./models/mdlCategory');

// Creates each route link
var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var articleRouter = require('./routes/article');
var commentRouter = require('./routes/comment');
var categoryRouter = require('./routes/category');

// Create all listener for each route link
app.use('/', indexRouter);
app.use('/author', authorRouter);
app.use('/article', articleRouter);
app.use('/comment', commentRouter);
app.use('/category', categoryRouter);

// Execute local API server and create listener on port 5005
var server = app.listen(5005, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});
