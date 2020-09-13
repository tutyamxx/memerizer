const app = require("../app");
const request = require("supertest");
const isBase64 = require("is-base64");

const AllowedGenderValues = [ "f", "m" ];

describe("🎯 Testing (Be Like Bill) API endpoint", () =>
{
    it("POST - Should return a message and a status code of (404) for POST requests", (done) =>
    {
        request(app).post("/api/v1/belike")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(404);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(404);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Sorry, can't access the endpoint you are looking for 👀. Is it POST or GET 🤔 ?");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if there is no query specified", (done) =>
    {
        request(app).get("/api/v1/belike")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid first query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the `name` query is empty", (done) =>
    {
        request(app).get("/api/v1/belike?name=")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid first query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the `gender` query is not specified", (done) =>
    {
        request(app).get("/api/v1/belike?name=testing")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid second query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the `gender` query is empty", (done) =>
    {
        request(app).get("/api/v1/belike?name=testing&gender=")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid second query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the `gender` query is not a valid value of F or M", (done) =>
    {
        request(app).get("/api/v1/belike?name=testing&gender=g")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid second query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if all the queries have been specified but the query `format` is not present", (done) =>
    {
        request(app).get(`/api/v1/belike?name=testing&gender=${AllowedGenderValues[Math.floor(Math.random() * AllowedGenderValues.length)]}`)
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("You either did not specify a return format query or the query value was wrong. Just add a query at the end named format='buffer or base64' ! 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if all the queries have been specified, but the `format` query contains an invalid format", (done) =>
    {
        request(app).get(`/api/v1/belike?name=testing&gender=${AllowedGenderValues[Math.floor(Math.random() * AllowedGenderValues.length)]}&format=nope`)
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("You either did not specify a return format query or the query value was wrong. Just add a query at the end named format='buffer or base64' ! 🙄");

            done();
        });
    });

    it("GET - Should return a buffer and a status code of (200) if all the queries specified are correct and the `format` query is set to `buffer`", (done) =>
    {
        request(app).get(`/api/v1/belike?name=testing&gender=${AllowedGenderValues[Math.floor(Math.random() * AllowedGenderValues.length)]}&format=buffer`)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(Buffer.isBuffer(response.body)).to.be.true;

            done();
        });
    });

    it("GET - Should return a base64 string of the image and a status code of (200) if all the queries specified are correct and the `format` query is set to `base64`", (done) =>
    {
        request(app).get(`/api/v1/belike?name=testing&gender=${AllowedGenderValues[Math.floor(Math.random() * AllowedGenderValues.length)]}&format=base64`)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(response.text).to.be.a("string").and.to.not.be.empty;
            expect(isBase64(response.text)).to.be.true;

            done();
        });
    });
});