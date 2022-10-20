// process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();

const database = require("../db/database.js");
const collectionName = "crowd"

chai.use(chaiHttp);

describe('Document integration', () => {

    before(async () => {

        const db = await database.getDb(collectionName);

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {

                let newDoc = {
                    namn: "Mumin",
                    bor: "Mumindalen"
                }
                if (info) {
                    await db.collection.drop();
                    await db.collection.insertOne(newDoc);
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });


    describe('GET /', () => {
        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.eql(1);
                    done();
                })
        });


    describe('POST / Save', () => {
        it('POST / Create new doc', (done) => {
            let newDoc = {
                namn: "Sniff",
                text: "Bor hemma hos Mumin och är bra kompisar",
                owner: "test@test.se",
                allowed_users: [
                    "test@test.se"
                ]  
            };

            chai.request(server)
                .post("/save")
                .send(newDoc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    done();
                });
        });
        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.eql(2);

                    done();
                });
        });
    });

    describe('POST / Init', () => {
        it('Insert doc from json-file', (done) => {
            chai.request(server)
                .get("/init")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.eql(5);
                    done();
                });
        });
    });

    describe('PUT / Update', () => {
       it('Update doc', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    let updateDoc = {
                        _id: res.body.data[1]['_id'],
                        namn: "Snorkelfröken",
                        text: "Plockar blommor vid Muminhus",
                        owner: "test@test.se",
                        allowed_users: [
                            "test@test.se"
                        ]  
                    };

                    chai.request(server)
                        .put("/update")
                        .send(updateDoc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
            });
        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data[1]['text'].should.be.eql('Plockar blommor vid Muminhus')
                    res.body.data.length.should.be.eql(5);
                    done();
                });
        });
    });

    describe('GET / Delete', () => {
        it('Delete all docs', (done) => {
            chai.request(server)
            .get("/delete")
            .end((err, res) => {
                res.should.have.status(200);
                done();
        });
        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', process.env.USER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(0);
                    done();
                });
            });
        });
    });


});
});
