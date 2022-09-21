const express = require('express')
const app = express()
const pool = require('./db')
const cors = require('cors')
const TodoRouter = require('./routers/todoRouter')
app.use(express.json())
app.use(cors())
const PORT = 5000


app.use('/', TodoRouter)
app.use((err, req, res, next) => {
    let code = res.statusCode ? res.statusCode : 500
    return res.json({
        error: {
            code,
            message: err.message
        }
    })
})

app.listen(PORT, async () => {
    console.log('connected @', PORT)
})