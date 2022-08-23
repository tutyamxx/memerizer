const app = require('../app');
const request = require('supertest');
const isBase64 = require('is-base64');
const chai = require('chai');
const { expect } = chai;

describe('🎯 Testing (Cold Hard Truth) API endpoint', () => {
    it('POST - Should return a message and a status code of (404) for POST requests', (done) => {
        request(app).post('/api/v1/truth')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(404);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(404);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('Sorry, can\'t access the endpoint you are looking for 👀. Is it POST or GET 🤔 ?');

                done();
            });
    });

    it('GET - Should return a message and a status code of (400) if there is no query specified', (done) => {
        request(app).get('/api/v1/truth')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(400);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('Invalid text query specified! You need to specifiy a text in your query parameter. Correct usage is /truth?text=\'your cold hard truth here\' 🙄');

                done();
            });
    });

    it('GET - Should return a message and a status code of (400) if the `text` query is empty', (done) => {
        request(app).get('/api/v1/truth?text=')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(400);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('Invalid text query specified! You need to specifiy a text in your query parameter. Correct usage is /truth?text=\'your cold hard truth here\' 🙄');

                done();
            });
    });

    it('GET - Should return a message and a status code of (400) if the `text` query length is higher than 158 characters', (done) => {
        request(app).get('/api/v1/truth?text=LKdx1XY72yoFgTkXd1rXHUmnUFMoW3HIiNAC0c27pHPPAMGd9JL4NfVgx3drIjwHjrQtJnpQ5pYhmKlKFl43AwxeYK8bbQCwQID6cysLxIgEnG6xaFBhz7yI33lFrFHYhu4kxSJDX5m89l1scTGykzgteYJv1i2')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(400);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('Your text is too long. Maximum 158 characters please... 🙄');

                done();
            });
    });

    it('GET - Should return a message and a status code of (400) if the query `text` is not empty but the query `format` is not present', (done) => {
        request(app).get('/api/v1/truth?text=i like testing')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(400);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('You either did not specify a return format query or the query value was wrong. Just add a query at the end named format=\'buffer or base64\' ! 🙄');

                done();
            });
    });

    it('GET - Should return a message and a status code of (400) if all the queries have been specified, but the `format` query contains an invalid format', (done) => {
        request(app).get('/api/v1/truth?text=i like testing&format=nope')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(400);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('You either did not specify a return format query or the query value was wrong. Just add a query at the end named format=\'buffer or base64\' ! 🙄');

                done();
            });
    });

    it('GET - Should return a buffer and a status code of (200) if all the queries specified are correct and the `format` query is set to `buffer`', (done) => {
        request(app).get('/api/v1/truth?text=testing&format=buffer').end((err, response) => {
            expect(response.status).to.be.equal(200);
            // eslint-disable-next-line no-undef
            expect(Buffer.isBuffer(response.body)).to.be.true;

            done();
        });
    });

    it('GET - Should return a base64 string of the image and a status code of (200) if all the queries specified are correct and the `format` query is set to `base64`', (done) => {
        request(app).get('/api/v1/truth?text=testing&format=base64').end((err, response) => {
            expect(response.status).to.be.equal(200);
            expect(response.text).to.be.a('string').and.to.not.be.empty;
            expect(isBase64(response.text)).to.be.true;

            done();
        });
    });
});
