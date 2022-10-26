process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();
chai.use(chaiHttp);


describe('Auth integration', () => {
    describe('Sign in and integrate with not registered mail', () => {
        it('POST /auth/login, 401 STATUS and user missing', (done) => {
            let newUser = {
                email: "hej@test.se",
                password: "test1234",
            };
        
            chai.request(server)
                .post("/auth/login")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(401); // FAILED STATUS
                    res.text.should.be.a('string').and.to.be.eql('{"data":{"message":"User does not exist"}}');
                    done();
                });
        })
        it('POST /auth/login, 401 STATUS and email or password is missing', (done) => {
            let newUser = {
                email: null,
                password: null,
            };
        
            chai.request(server)
                .post("/auth/login")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400); // FAILED STATUS
                    res.text.should.be.a('string').and.to.be.eql('{"errors":{"status":400,"message":"Email or password is missing"}}');
                    done();
                });
        })
        it('POST /auth/login, 400 STATUS and incorrect password', (done) => {
            let newUser = {
                email: "test@test.se",
                password: "test",
            };
        
            chai.request(server)
                .post("/auth/login")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(401); // FAILED STATUS
                    res.text.should.be.a('string').and.to.be.eql('{"errors":{"status":401,"message":"Incorrect password"}}');
                    done();
                });
        })
        it('POST /auth/register, 401 STATUS and email or password is missing', (done) => {
            let newUser = {
                email: null,
                password: null,
            };
        
            chai.request(server)
                .post("/auth/register")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400); // FAILED STATUS
                    res.text.should.be.a('string').and.to.be.eql('{"errors":{"status":400,"message":"Email or password is missing"}}');
                    done();
                });
        }),
        it('POST /auth/register, 400 STATUS and email not valid ', (done) => {
            let newUser = {
                email: "test",
                password: "test1234",
            };
        
            chai.request(server)
                .post("/auth/register")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400); // FAILED STATUS
                    console.log(res.text)
                    res.text.should.be.a('string').and.to.be.eql('{"errors":{"status":400,"message":"Email is not in correct format"}}');
                    done();
                });
        })
    });
});


   