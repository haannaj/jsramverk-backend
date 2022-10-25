process.env.NODE_ENV = 'test';

const bodyParser = require('body-parser');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();

const database = require("../db/database.js");
const collectionName = "crowd"

chai.use(chaiHttp);



describe('Mail integration', () => {

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
                    ]  
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


    describe('Login', () => {
        var token = "";

        it('POST / Login', (done) => {
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
        it('POST / Send invite to doc', (done) => {
            let newMail = 'hanna.jessie.johansson@gmail.com'

            chai.request(server)
                .post(`/api/sendaccessemail/${newMail}`)
                .end((err, res) => {
                    res.should.have.status(200); // CREATED-STATUS
                    res.text.should.be.a('string', 'email sent!');
                    done();
                });
        });
        it('GET / Getting docs id', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    docID = res.body.data[0]['_id']
                    res.should.have.status(200);
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.eql(1);
                    done();
                })
        });
        it('POST / Add email to doc with id', (done) => {
            let newMail = 'hanna.jessie.johansson@gmail.com,test@test.se'
            
            chai.request(server)
                .post(`/api/update/${newMail}/${docID}`)
                .end((err, res) => {
                    res.should.have.status(200); 
                    res.text.should.be.a('string', 'email sent!');
                    done();
                });
        });
        it('GET / New email been added to doc', (done) => {
            chai.request(server)
                .get("/")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.body.data[0]['allowed_users'].should.be.an("array")
                    res.body.data[0]['allowed_users'].should.be.eql(['hanna.jessie.johansson@gmail.com','test@test.se'])
                    done();
                })
        });

    });
});


   