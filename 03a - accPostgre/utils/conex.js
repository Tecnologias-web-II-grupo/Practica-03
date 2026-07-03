// Connect to the database
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apidb',
    password: 'parda99*',
    port: 5432,
})

module.exports = pool;
