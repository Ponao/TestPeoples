const envFound = require('dotenv').config()
if (!envFound) {
    console.log(
      '⚠️  No .env file found'
    )
    process.exit(0)
}

const express = require('express')
const cors = require('cors')
const path = require('path')
const fileUpload = require('express-fileupload')
const historyApiFallback = require('connect-history-api-fallback')

const authRoutes = require('./routes/auth')
const userRouter = require('./routes/user')
const peopleRouter = require('./routes/people')

const app = express()

app
    .use(express.json())
    .use(fileUpload({
      createParentPath: true
    }))
    .use(cors())
    .use('/api/auth', authRoutes)
    .use('/api/user', userRouter)
    .use('/api/people', peopleRouter)
    .use('/avatars', express.static(path.join(__dirname, './avatars')))
    .use(historyApiFallback())

const http = require("http").createServer(app)

http.listen(process.env.PORT, () => {
    console.log(`Local Server for dev started: http://localhost:${process.env.PORT}`)
})