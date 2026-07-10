import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from 'bcryptjs';


// ---------------------------------------------------
// Section - Creates and configures the application
// ---------------------------------------------------
// Create the express app
const app = express();

// Global rate limiting for the API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status_code: 429,
        status_message: "Too Many Requests",
        body_message: "Demasiadas solicitudes. Intente de nuevo más tarde."
    }
});
app.use(apiLimiter);

// Set up CORS
var corsOptions = {
    origin: "http://localhost:5010",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS, Cross-Origin Resource Sharing, to allow API to be accessed by web pages,
// and other web origins. This is a security feature to prevent unauthorized access.
app.use(cors(corsOptions));

// Limit request body size for JSON and URL-encoded payloads
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Protect headers and enforce Content Security Policy
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'", "http://localhost:5010"],
                imgSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"]
            }
        }
    })
);

// Limit response payload size to avoid sending overly large responses
const MAX_RESPONSE_SIZE_BYTES = 200 * 1024; // 200 KB
app.use((req, res, next) => {
    let sentBytes = 0;
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = function (chunk, encoding, callback) {
        if (chunk) {
            sentBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
        }
        if (sentBytes > MAX_RESPONSE_SIZE_BYTES) {
            if (!res.headersSent) {
                res.statusCode = 413;
                return originalEnd(JSON.stringify({
                    status_code: 413,
                    status_message: "Payload Too Large",
                    body_message: "La respuesta supera el tamaño máximo permitido."
                }));
            }
        }
        return originalWrite(chunk, encoding, callback);
    };

    res.end = function (chunk, encoding, callback) {
        if (chunk) {
            sentBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
        }
        if (sentBytes > MAX_RESPONSE_SIZE_BYTES) {
            if (!res.headersSent) {
                res.statusCode = 413;
                return originalEnd(JSON.stringify({
                    status_code: 413,
                    status_message: "Payload Too Large",
                    body_message: "La respuesta supera el tamaño máximo permitido."
                }));
            }
        }
        return originalEnd(chunk, encoding, callback);
    };
    next();
});

// Add cookie session
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(
    cookieSession({
        name: "demoyork-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true,
        expires: expiryDate
    })
);

// Set request and response timeout
app.use((req, res, next) => {
    req.setTimeout(5000); // Set request timeout to 5 seconds
    res.setTimeout(5000); // Set response timeout to 5 seconds
    next();
});

// Enable headers for CORS
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});


// ---------------------------------------------------
// Section - Creates the database connection
// ---------------------------------------------------
// Import the database connection variables
import dbConfig  from './config/configDB.js';

// Try to connect to the database
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial().then(r => console.log("Initial roles created"));
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Load models
import './models/mdl_Users.js';
import './models/mdl_Roles.js';

// Create the initial roles if they do not exist
async function initial() {
    const Roles = mongoose.model('Roles');
    const Users = mongoose.model('Users');

    await Roles.estimatedDocumentCount().then((count) => {
        if (count === 0) {
            const newRoles = [
                {
                    name: "root",
                    level: 4,
                    description: "Rol superior, soporte global"
                },
                {
                    name: "admin",
                    level: 3,
                    description: "Rol administrativo (acceso parcial actualizaciones/consultas)"
                },
                {
                    name: "user",
                    level: 2,
                    description: "Usuario normal (acceso parcial)"
                },
                {
                    name: "guest",
                    level: 1,
                    description: "Invitado (solo ciertas consultas)"
                }
            ];

            Roles.insertMany(newRoles).then(() => {
                console.log("Roles creados: root, admin, user, guest");
                createRootUser();
            }).catch(err => {
                console.log("Error al crear roles:", err);
            });
        }
    });
}

async function createRootUser() {
    const Users = mongoose.model('Users');
    
    const rootExists = await Users.findOne({ username: "root" });
    
    if (!rootExists) {
        const newRootUser = new Users({
            fullname: "Administrator Root",
            email: "yul@gmail.com",
            username: "root",
            password: bcrypt.hashSync("root123456", 8),
            rol: "root",
            isProtected: true
        });
        
        await newRootUser.save().then(() => {
            console.log("Usuario ROOT creado exitosamente");
        }).catch(err => {
            console.log("Error al crear usuario ROOT:", err);
        });
    }
}


// ---------------------------------------------------
// Section - Creates application routes
// ---------------------------------------------------
// Simple route, create a greeting for the API
app.get("/", (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "Welcome to DemoYork application."
    };
    res.status(200).json(msgJson);
});

// Import the routes
import users from './routes/rout_Users.js' ;
import categories from "./routes/rout_Categories.js";

// Create all listener for each route link
app.use('/users', users);
app.use('/categories', categories);

// Catch unmatched routes and return JSON 404
app.use((req, res) => {
    res.status(404).json({
        status_code: 404,
        status_message: "Not Found",
        body_message: "La ruta solicitada no existe"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        status_code: status,
        status_message: status === 500 ? "Internal Server Error" : err.status_message || "Error",
        body_message: err.message || "Ocurrió un error en el servidor"
    });
});

// ---------------------------------------------------
// Section - Creates server
// ---------------------------------------------------
// Set port and listen for requests
const PORT = process.env.PORT || 5010;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Set up the server with keep-alive and headers timeout
server.keepAliveTimeout = 30 * 1000; // 30 seconds
server.headersTimeout = 35 * 1000; // 35 seconds
