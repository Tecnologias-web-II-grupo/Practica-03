const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
//const helmet = require("helmet")

// Creates the application
const app = express()

// Enable CORS, Cross-Origin Resource Sharing, to allow API to be accessed by web pages,
// and other web origins
app.use(cors());

// =========================================================================================
// Middleware order and error handling, if any error occurs in the application it will
// be handled by the error-handling middleware
// =========================================================================================
// Error handling for invalid routes
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(404).send('Not Found');
});

// Error handling for bad requests
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(400).send('Bad Request');
});

// Error handling for internal server errors
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error');
});


// Enable Helmet, a collection of 14 smaller middleware functions that set HTTP headers
// to secure the application
//app.use(helmet());

// Application parser to support JSON data format
app.use(bodyParser.json({ type: 'application/json' }))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// Creates each route link
var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var usersRouter = require('./routes/users');

// Create all listener for each route link
app.use('/', indexRouter);
app.use('/author', authorRouter);
app.use('/users', usersRouter);

// Execute local API server and create listener on port 5005
var server = app.listen(5000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});
