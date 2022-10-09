var express = require('express');
var router = express.Router();

const authModel = require("../models/users");


router.post(
    "/register",
    async (req, res) => {
        const body = req.body;

        await authModel.register(res, body);
    }
);

router.get(
    "/",
    async (req, res) => {
        const users = await authModel.getAllUsers();

        return res.json({
            data: users
        });
    }
);

router.get(
    "/delete",
    async (req, res) => {
        await authModel.deleteAll();

        res.send("all users been deleted!");
    }
);

router.post(
    "/login",
    async (req, res) => {
        const body = req.body;

        await authModel.login(res, body);
    }
);



module.exports = router;



