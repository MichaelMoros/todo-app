const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const TodoRouter = require('./routers/todoRouter')
const ErrorHandler = require('./middlewares/errorHandler')

const corsOptions = {
    origin: [process.env.CLIENT_SIDE_ADDRESS, process.env.CLIENT_SIDE_ADDRESS1],
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/', TodoRouter)
app.use(ErrorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    console.log('connected @', PORT)
})