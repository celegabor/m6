const express = require('express')
const { createTransport } = require('nodemailer')
const email = express.Router()

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hubert30@ethereal.email',
        pass: 'essTGcDwm7egMnPNsa'
    }
});

email.post('/send-email', async(req, res)=>{
    const { recipient, subject, text } = req.body

    const mailOptions = {
        from: 'celegabor@gmail.com',
        to: 'celegabor@gmail.com',
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error) {
            console.log(error);
            res.status(500).send('errore durante invio mail')
        } else {
            console.log('mail inviata');
            res.status(200).send('email inviata')
        }
    })

})

module.exports = email