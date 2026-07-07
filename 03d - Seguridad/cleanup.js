import mongoose from 'mongoose';
import dbConfig from './config/configDB.js';

mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
    .then(() => {
        console.log("Conectado a MongoDB");
        return Promise.all([
            mongoose.connection.collection('users').deleteMany({}),
            mongoose.connection.collection('roles').deleteMany({})
        ]);
    })
    .then(() => {
        console.log("Base de datos limpiada");
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
