var express = require('express');
var router = express.Router();
const documentModel = require("../models/document");


router.get(
    "/",
    async (req, res) => {
        const documents = await documentModel.getAllDoc();

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

        res.send("tjo tjim!");
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

module.exports = router;



