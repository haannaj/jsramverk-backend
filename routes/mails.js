require('dotenv').config()
const express = require("express");
var router = express.Router();

const mailModel = require("../models/mail");


const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN,
});

router.post(
    "/sendaccessemail/:mail", 
    async (req, res) => {

        let data = {
            from: "Jsramverk Editor",
            to: [req.params.mail],
            subject: "Injudan redigera dokument",
            text: "Registrera dig för att få tillgång till dokumentet, https://www.student.bth.se/~hajh20/editor/",
        };
        
        try {
            await mailModel.sendAccessMail(data);
            res.send("email sent!")

        } catch(e) {
            console.log(e);
            res.status(500);
        }

    }
);

router.post(
    "/update/:mail/:doc",
    async (req, res) => {

        try {
            
            const info = req.params

            console.log(info)

            await mailModel.updateDocMail(info);

            res.send("Updated!");
        } catch(e) {
            console.log(e);
            res.status(500);
        }

        
    }
);


module.exports = router;



