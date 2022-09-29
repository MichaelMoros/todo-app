const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DB_URL

const PGHOST = 'localhost'
const PGUSER = 'postgres'
const PGDATABASE = 'Testdb'
const PGPASSWORD = 'root'
const PGPORT = 5432

const pool = process.env.ENVIRONMENT === 'production' ? new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
}) : new Pool({
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool