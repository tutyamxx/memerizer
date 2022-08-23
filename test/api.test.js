const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const { expect } = chai;

describe('🎯 Testing default API endpoint', () => {
    it('GET - Should return a meme message and a status code of OK (200)', (done) => {
        request(app).get('/api/v1/')
            .expect('Content-Type', /json/)
            .end((err, response) => {
                expect(response.status).to.be.equal(200);
                expect(response.body).to.be.a('object');
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property('status').and.to.be.a('number').and.to.be.equal(200);
                expect(response.body).to.have.a.property('message').and.to.be.a('string').and.to.be.equal('I don\'t always access endpoints, but when I do, I get a 200 status 🤘🏽🤪🤘🏽');

                done();
            });
    });

    it('POST - Should return a message and a status code of (404) for POST requests', (done) => {
        request(app).post('/api/v1/')
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
});
