const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const UsersModel = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

login.post('/login', async(req, res)=>{
    const user = await UsersModel.findOne({email: req.body.email})

    if(!user){
        return res.status(404).send({
            message: 'nome utente errato o inesistente',
            statusCode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword){
        return res.status(400).send({
            message: 'email o password errati',
            statusCode: 400
        })
    }

    // token
    const token = jwt.sign({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob
    }, process.env.JWT_SECRET,{
        expiresIn: '24h'
    })

    res.header('Authorization', token).status(200).send({
        message: 'login effettuato con successo',
        statusCode: 200,
        token
    })

})


module.exports = login