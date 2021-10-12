const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: email,
        pass: password
    }
});

const handlebarsOptions = {
    viewEngin: {
        extName: '.hbs',
        defaultLayout: null,
        partialsDir: '../templates/',
        layoutsDir: '../templates/'
    },
    viewPath: path.resolve('../templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

const router = express.Router();

router.post('/forgot-password', async(request, response) => {
    if(!request.body || !request.body.email) {
        response.status(400).json({message: 'Invalid body', status: 400});
    }
    else
    {
        const userEmail = request.body.email;

        // Send user passwor reset email
        const emailOptions = {
            to: userEmail,
            from: email,
            template: 'forgot-password',
            subject: 'Zenva Phaser MMO Password Reset',
            context: {
                name: 'Joe',
                url: `http://localhost:${process.env.PORT || 3000}`
            }
        };
        await smtpTransport.sendMail(emailOptions);

        response.status(200).json({ message: 'An email has been sent to your email address. Password reset link is only valid for 10 minutes.', status: 200 });
    }
});

router.post('/reset-password', async(request, response) => {
    if(!request.body || !request.body.email) {
        response.status(400).json({message: 'Invalid body', status: 400});
    }
    else
    {
        const userEmail = request.body.email;

        // Send user passwor update email
        const emailOptions = {
            to: userEmail,
            from: email,
            template: 'reset-password',
            subject: 'Zenva Phaser MMO Password Reset Confirmation',
            context: {
                name: 'Joe'
            }
        };
        await smtpTransport.sendMail(emailOptions);

        response.status(200).json({ message: 'Password updated', status: 200 });
    }
});

module.exports = router;