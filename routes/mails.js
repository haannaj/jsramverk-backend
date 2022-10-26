require('dotenv').config()
const express = require("express");
var router = express.Router();

const mailModel = require("../models/mail");


router.post(
    "/sendaccessemail/:mail", 
    async (req, res) => {

        let data = {
            from: "Jsramverk Editor, <no-reply@test.se>",
            to: [req.params.mail],
            subject: "Injudan redigera dokument",
            text: "Registrera dig för att få tillgång till dokumentet, https://www.student.bth.se/~hajh20/editor/",
        };
        
        try {
            const result = await mailModel.sendAccessMail(data);
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
            await mailModel.updateDocMail(info);

            res.send("Updated!");
        } catch(e) {
            console.log(e);
            res.status(500);
        }
        
    }
);


module.exports = router;

