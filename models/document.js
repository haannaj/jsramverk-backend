const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../routes/setup_docs.json"),
    "utf8"
));
const collectionName = "crowd";


const documents = {
    getAllDoc: async function getAllDoc() {

        let db;

        try {
            db = await database.getDb(collectionName);

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
            db = await database.getDb(collectionName);

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

            db = await database.getDb(collectionName);

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

            db = await database.getDb(collectionName);

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

            db = await database.getDb(collectionName);

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
    getDocById: async function getDocById(userID) {

        let db;


        try {
            db = await database.getDb(collectionName);

            const alldocs = await db.collection.find({allowed_users: userID}).toArray();

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
    updateDocComment: async function updateDocComment(doc) {
        let db;

        let ID = doc["_id"]
        delete doc["_id"]

        try {

            db = await database.getDb(collectionName);

            const filter = { _id: ObjectId(ID) };
            
            const result = await db.collection.updateOne(
                filter, {
                    $push: {
                      comments: doc,
                    }
                  }
            )

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    
};

module.exports = documents;
