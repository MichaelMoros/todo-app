const { Pool } = require('pg')
require('dotenv').config()
const connectionString = process.env.DB_URL ? process.env.DB_URL : 'postgres://' + String(process.env.DB_USER) + ':' + String(process.env.DB_PASSWORD) + '@' + String(process.env.DB_HOST) + '/' + String(process.env.DB)

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool