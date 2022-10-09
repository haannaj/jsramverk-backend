const mongo = require("mongodb").MongoClient;
require('dotenv').config()

const database = {
    getDb: async function getDb (collectionName) {

        // let dsn = `mongodb://localhost:27017/test`;
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.kiyuqpr.mongodb.net/?retryWrites=true&w=majority`

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


        const db = await client.db();

        const collection = await db.collection(collectionName);


        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;

