process.env.NODE_ENV = 'test';

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
                    namn: "Mumintrollet",
                    text: "Bor i Mumindalen",
                    owner: "test@test.se",
                    allowed_users: [
                        "test@test.se"
                    ],
                    comments: []
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


    describe('Sign in and integrate with docs', () => {
        var token = "";

        it('POST /auth/login, 201 HAPPY PATH and sign in', (done) => {
            let newUser = {
                email: "test@test.se",
                password: "test1234",
            };
        
            chai.request(server)
                .post("/auth/login")
                .send(newUser)
                .end((err, res) => {
                    token = res.body.data.token;
                    res.should.have.status(201); // CREATED STATUS

                    done();
                });
        }),

        it('GET / 200 HAPPY PATH getting all docs', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.eql(1);
                    done();
                })
        });

        it('POST /save, 201 HAPPY PATH and create new doc and save to database', (done) => {
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
        it('GET / 200 HAPPY PATH and checking new document saved in database', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.eql(2);
                    done();
                });
        });
        it('GET /init, 200 HAPPY PATH and insert doc from json-file', (done) => {
            chai.request(server)
                .get("/init")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('GET / 200 HAPPY PATH and checking document from json-file', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.eql(5);
                    done();
                });
        });
        it('PUT /update, 200 HAPPY PATH and update doc', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
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
        it('GET / 200 HAPPY PATH and check doc been updated', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an("array");
                    res.body.data[1]['text'].should.be.eql('Plockar blommor vid Muminhus')
                    res.body.data.length.should.be.eql(5);
                    done();
                });
        });
        it('PUT /updatecomments, 200 HAPPY PATH and update doc with comment', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    let updateDoc = {
                        _id: res.body.data[0]['_id'],
                        frase: "Mumindalen",
                        comment: "Som ligger i Mumintown",
                        time: "Mon Oct 24 2022 18:24:00",
                        owner: res.body.data[0]['owner'],
                    };

                    chai.request(server)
                        .put("/updatecomments")
                        .send(updateDoc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
            });
        it('GET / 200 HAPPY PATH and check doc been updated with comment', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data[0]['comments'].should.be.an("array");
                    res.body.data[0]['comments'][0]['frase'].should.be.eql("Mumindalen")
                    res.body.data[0]['comments'][0]['comment'].should.be.eql("Som ligger i Mumintown")
                    res.body.data[0]['comments'][0]['owner'].should.be.eql("test@test.se")
                    res.body.data[0]['comments'][0]['time'].should.be.eql("Mon Oct 24 2022 18:24:00")
                    done();
                });
        });
        it('GET /delete 200 HAPPY PATH and delete all docs', (done) => {
            chai.request(server)
            .get("/delete")
            .end((err, res) => {
                res.should.have.status(200);
                done();
        });
        it('GET / 200 HAPPY PATH checking all doc is deleted', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(0);
                    done();
                });
            });
        });
});
});
