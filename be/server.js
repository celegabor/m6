const express = require('express');
const mongoose = require('mongoose');
const postsRoute = require('./routes/posts')
const userRoute = require('./routes/users')
const emailRoute = require('./routes/sendMail')
const path = require('path')
require('dotenv').config()
const cors = require('cors')
const loginRoute = require('./routes/login')

const app = express();

const PORT = 2105;
app.use(express.static('pubblic'))

app.use(express.json())
app.use(cors())
app.use('/', postsRoute)
app.use('/', userRoute)
app.use('/', emailRoute)
app.use('/', loginRoute)

mongoose.connect(process.env.MONGODB_URL,{
    uSeNewUrLParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console,'error during db connection'))
db.once('open', ()=>{
    console.log('database successfully open');
})
app.listen(PORT, ()=> console.log('server up', PORT));