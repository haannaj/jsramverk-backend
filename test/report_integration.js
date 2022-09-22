process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();

const database = require("../db/database.js");
const collectionName = "crowd"

chai.use(chaiHttp);


describe('Reports', () => {

    before(async () => {

        const db = await database.getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });

    describe('GET /api_key', () => {
        it('200 HAPPY PATH getting form', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.eql(0);
                    console.log(res.body.data.length)

                    done();
                });
        });
        // it('Create new doc', (done) => {
        //     let newDoc = {
        //         namn: "Snorkelfröken",
        //         bor: "Mumindalen"
        //     };

        //     chai.request(server)
        //         .post("/save")
        //         .send(newDoc)
        //         .end((err, res) => {
        //             res.should.have.status(201);
        //             done();
        //         });
        // });
        // it('Insert doc from json-file', (done) => {
        //     chai.request(server)
        //         .get("/init")
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             done();
        //         });
        // });
    });
});
