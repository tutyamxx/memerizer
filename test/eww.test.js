const app = require("../app");
const request = require("supertest");
const isBase64 = require("is-base64");

describe("🎯 Testing (Eww I Stepped in Shit) API endpoint", () =>
{
    it("POST - Should return a message and a status code of (404) for POST requests", (done) =>
    {
        request(app).post("/api/v1/eww")
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
        request(app).get("/api/v1/eww")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid name query specified! You need to specifiy a name in your query parameter. Correct usage is /eww?name='your shitty name' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the `name` query is empty", (done) =>
    {
        request(app).get("/api/v1/eww?name=")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid name query specified! You need to specifiy a name in your query parameter. Correct usage is /eww?name='your shitty name' 🙄");

            done();
        });
    });

    it("GET - Should return a message and a status code of (400) if the query `name` is not empty but the query `format` is not present", (done) =>
    {
        request(app).get("/api/v1/eww?name=testing")
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
        request(app).get("/api/v1/eww?name=testing&format=nope")
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
        request(app).get("/api/v1/eww?name=testing&format=buffer").end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(Buffer.isBuffer(response.body)).to.be.true;

            done();
        });
    });

    it("GET - Should return a base64 string of the image and a status code of (200) if all the queries specified are correct and the `format` query is set to `base64`", (done) =>
    {
        request(app).get("/api/v1/eww?name=testing&format=base64").end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(response.text).to.be.a("string").and.to.not.be.empty;
            expect(isBase64(response.text)).to.be.true;

            done();
        });
    });
});