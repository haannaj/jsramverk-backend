const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../routes/setup.json"),
    "utf8"
));

const documents = {
    getAllDoc: async function getAllDoc() {

        let db;

        try {
            db = await database.getDb();

            const alldocs = await db.collection.find().toArray();

            return alldocs;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },
    insertDoc: async function insertDoc(newDoc) {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.insertOne(newDoc);
            
            return {
                ...newDoc,
                _id: result.insertedId,
            };
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    init: async function init() {
        let db;

        try {

            db = await database.getDb();

            const result = await db.collection.insertMany(docs);

            console.log(`${result.insertedCount} documents were inserted`);
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    deleteAll: async function deleteAll() {
        let db;

        try {

            db = await database.getDb();

            const result = await db.collection.deleteMany();

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    updateDoc: async function updateDoc(doc) {
        let db;

        let ID = doc["_id"]
        delete doc["_id"]

        try {

            db = await database.getDb();

            const filter = { _id: ObjectId(ID) };

            const result = await db.collection.updateOne(
                filter , { $set: doc }
                );

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
};

module.exports = documents;
