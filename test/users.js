import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/server'
import userModel from '../src/model/user-model'


const should = chai.should()

chai.use(chaiHttp)

describe('users when the database is empty', () => {
    beforeEach((done) => {
        userModel.deleteMany({}, () => {
            done()
        })
    })

    describe('GET /users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
    })

    describe('GET /user/:id', () => {
        it('it should return a "User not found" message', (done) => {
            const id = 'not-existing'

            chai.request(server)
                .get(`/user/${id}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql(`User with id ${id} not found`)
                    done()
                })
        })
    })

    describe('POST /user', () => {
        it('it should create a new user and response with format: \n\t{\n\t\tmessage: <string>,\n\t\tuser: {\n\t\t\t_id: <uid>,\n\t\t\tage: <number>,\n\t\t\tgender: <string>,\n\t\t\temail: <string>\n\t\t}\n\t}', (done) => {
            chai.request(server)
                .post('/user')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('User created successfully')
                    res.body.should.have.property('user')
                    res.body.user.should.have.property('_id')
                    res.body.user.should.have.property('age')
                    res.body.user.should.have.property('gender')
                    res.body.user.should.have.property('email')
                    done()
                })
        })
    })

    describe('POST /user?age=21&gender=male&email=adamtherandom@gmail.com', () => {
        it('it should create a new user and response with exactly: \n\t{\n\t\tmessage: \'User created successfully\',\n\t\tuser: {\n\t\t\t_id: <auto-generated uid>,\n\t\t\tage: 21,\n\t\t\tgender: \'male\',\n\t\t\temail: \'adamtherandom@gmail.com\'\n\t\t}\n\t}', (done) => {
            chai.request(server)
                .post('/user?age=21&gender=male&email=adamtherandom@gmail.com')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('User created successfully')
                    res.body.should.have.property('user')
                    res.body.user.should.have.property('_id')
                    res.body.user.should.have.property('age').eql(21)
                    res.body.user.should.have.property('gender').eql('male')
                    res.body.user.should.have.property('email').eql('adamtherandom@gmail.com')
                    done()
                })
        })
    })
})

describe('users when the database has already three entries', () => {
    beforeEach((done) => {
        userModel.deleteMany({}, () => {
            userModel.insertMany([
                {
                    age: 37,
                    gender: "male",
                    email: "lee1983@gmail.com"
                },
                {
                    "age": 76,
                    "gender": "female",
                    "email": "kate1982@gmail.com"
                },
                {
                    "age": 16,
                    "gender": "male",
                    "email": "darian2000@gmail.com"
                }
            ], () => {
                done()
            })
        })
    })

    describe('GET /users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(3)
                    done()
                })
        })
    })

    describe('GET /user/:id', () => {
        it('it should find the user using existing ID', (done) => {
            userModel.findOne({}, (err, firstUser) => {
                chai.request(server)
                    .get(`/user/${firstUser._id}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('User found successfully')
                        res.body.should.have.property('user')
                        res.body.user.should.have.property('_id')
                        res.body.user.should.have.property('age').eql(37)
                        res.body.user.should.have.property('gender').eql('male')
                        res.body.user.should.have.property('email').eql('lee1983@gmail.com')
                        done()
                    })
            })
        })


        it('it should fall in finding the user using not existing ID and return error message', (done) => {
            const id = 'non-existing'

            chai.request(server)
                .get(`/user/${id}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql(`User with id ${id} not found`)
                    res.body.should.not.have.property('user')
                    done()
                })
        })
    })

    describe('POST /user', () => {
        it('it should create a new user and response with format: \n\t{\n\t\tmessage: <string>,\n\t\tuser: {\n\t\t\t_id: <uid>,\n\t\t\tage: <number>,\n\t\t\tgender: <string>,\n\t\t\temail: <string>\n\t\t}\n\t}', (done) => {
            chai.request(server)
                .post('/user')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('User created successfully')
                    res.body.should.have.property('user')
                    res.body.user.should.have.property('_id')
                    res.body.user.should.have.property('age')
                    res.body.user.should.have.property('gender')
                    res.body.user.should.have.property('email')
                    done()
                })
        })
    })

    describe('PUT /user/:id', () => {
        it('it should update the user when passed valid ID', (done) => {
            userModel.findOne({}, (err, firstUser) => {
                chai.request(server)
                    .put(`/user/${firstUser._id}`)
                    .send({
                        "age": 21,
                        "gender": "male",
                        "email": "example21male@gmail.com"
                    })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('User updated successfully')
                        res.body.should.have.property('user')
                        res.body.user.should.have.property('_id')
                        res.body.user.should.have.property('age').eql(21)
                        res.body.user.should.have.property('gender').eql('male')
                        res.body.user.should.have.property('email').eql('example21male@gmail.com')
                        done()
                    })
            })
        })

        it('it should return error message when passed non-valid ID', (done) => {
            const id = 'non-valid'

            chai.request(server)
                .put(`/user/${id}`)
                .send({
                    "age": 21,
                    "gender": "male",
                    "email": "example21male@gmail.com"
                })
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql(`User with id ${id} not found`)
                    res.body.should.not.have.property('user')
                    done()
                })
        })
    })


    describe('DELETE /user/:id', () => {
        it('it should delete the user when passed valid ID', (done) => {
            userModel.findOne({}, (err, firstUser) => {
                chai.request(server)
                    .delete(`/user/${firstUser._id}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('User deleted successfully')
                        res.body.should.have.property('user')
                        res.body.user.should.have.property('_id')
                        res.body.user.should.have.property('age').eql(37)
                        res.body.user.should.have.property('gender').eql('male')
                        res.body.user.should.have.property('email').eql('lee1983@gmail.com')
                        done()
                    })
            })
        })

        it('it should return error message when passed non-valid ID', (done) => {
            const id = 'non-valid'

            chai.request(server)
                .delete(`/user/${id}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql(`User with id ${id} not found`)
                    res.body.should.not.have.property('user')
                    done()
                })
        })
    })
})