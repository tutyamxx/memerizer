const app = require("../app");
const request = require("supertest");
const isBase64 = require("is-base64");

const FileImageCat = "https://i.imgur.com/YQczJjG.png";

describe("🎯 Testing (Blur) API endpoint", () =>
{
    it("GET - Should return a message and a status code of (404) for GET requests", (done) =>
    {
        request(app).get("/api/v1/blur")
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

    it("POST - Should return a message and a status code of (400) if there is no image URL provided", (done) =>
    {
        request(app).post("/api/v1/blur")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("You need to provide an actual image URL if you want your meme, duh... 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (415) if there is not a valid image URL provided", (done) =>
    {
        request(app).post("/api/v1/blur")
        .expect("Content-Type", /json/)
        .field("image", "dasdasdsa")
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(415);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(415);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("You need to provide a valid image URL 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if there is no query specified but a a valid image URL is attached", (done) =>
    {
        request(app).post("/api/v1/blur")
        .expect("Content-Type", /json/)
        .field("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid radius query specified! It has to be a number! Correct usage is /blur?radius=15 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if the `radius` query is empty or is not a number but a valid image URL is attached", (done) =>
    {
        request(app).post("/api/v1/blur?radius=dsadas")
        .expect("Content-Type", /json/)
        .field("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid radius query specified! It has to be a number! Correct usage is /blur?radius=15 🙄");
        });

        request(app).post("/api/v1/blur?radius=")
        .expect("Content-Type", /json/)
        .field("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid radius query specified! It has to be a number! Correct usage is /blur?radius=15 🙄");
        });

        done();
    });

    it("POST - Should return a message and a status code of (400) if a valid image URL is attached and all queries are specified but the query `format` is not present", (done) =>
    {
        request(app).post("/api/v1/blur?radius=25")
        .expect("Content-Type", /json/)
        .field("image", FileImageCat)
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

    it("POST - Should return a message and a status code of (400) if a valid image URL is attached and all queries are specified but the `format` query contains an invalid format", (done) =>
    {
        request(app).post("/api/v1/blur?radius=10&format=nope")
        .expect("Content-Type", /json/)
        .field("image", FileImageCat)
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

    it("POST - Should return a buffer and a status code of (200) if a a valid image URL is attached, all queries are specified and the `format` query is set to `buffer`", (done) =>
    {
        request(app).post("/api/v1/blur?radius=22&format=buffer")
        .field("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(Buffer.isBuffer(response.body)).to.be.true;

            done();
        });
    });

    it("POST - Should return a base64 string of the image and a status code of (200) if a valid image URL is attached, all queries are specified and the `format` query is set to `base64`", (done) =>
    {
        request(app).post("/api/v1/blur?radius=13&format=base64")
        .field("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(response.text).to.be.a("string").and.to.not.be.empty;
            expect(isBase64(response.text)).to.be.true;

            done();
        });
    });
});