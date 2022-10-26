const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../routes/setup_docs.json"),
    "utf8"
));
const collectionName = "crowd";

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
});

const mail = {
    sendAccessMail: async function sendAccessMail(data) {
        try {
            return mailgun.messages().send(data);
        } catch(e) {
            console.log(e)
            res.status(500);
            return e;
        }
    },
    updateDocMail: async function updateDocMail(info) {
        let db;

        const users = info.mail.split(",")

        try {

            db = await database.getDb(collectionName);

            const filter = { _id: ObjectId(info.doc) };

            const result = await db.collection.updateOne(
                filter , { $set: { "allowed_users" : users }}
                );

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
}

module.exports = mail;