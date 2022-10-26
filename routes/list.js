var express = require('express');
var router = express.Router();

const documentModel = require("../models/document");
const usersModel = require("../models/users");


router.get(
    "/",
    (req, res, next) => usersModel.checkToken(req, res, next),

    async (req, res) => {
        const documents = await documentModel.getAllDoc();

        return res.json({
            data: documents
        });
    }
);


router.get(
    "/usersdoc/:userid",
    (req, res, next) => usersModel.checkToken(req, res, next),

    async (req, res) => {
        const documents = await documentModel.getDocById(req.params.userid);

        return res.json({
            data: documents
        });
    }
);

router.post(
    "/save",
    async (req, res) => {
        const newDocs = req.body;

        const result = await documentModel.insertDoc(newDocs);

        return res.status(201).json({ data: result });
    }
);

router.get(
    "/init",
    async (req, res) => {
        await documentModel.init();

        res.send("documents have been inserted");
    }
);

router.get(
    "/delete",
    async (req, res) => {
        await documentModel.deleteAll();

        res.send("all docs been deleted!");
    }
);

router.put(
    "/update",
    async (req, res) => {

        const doc = req.body;
        await documentModel.updateDoc(doc);

        res.send("Updated!");
    }
);

router.put(
    "/updatemail",
    async (req, res) => {

        const doc = req.body;
        await documentModel.updateDocMail(doc);

        res.send("Updated!");
    }
);

router.put(
    "/updatecomments",
    async (req, res) => {

        const doc = req.body;
        await documentModel.updateDocComment(doc);

        res.send("Updated!");
    }
);

module.exports = router;



