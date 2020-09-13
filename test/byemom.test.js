const app = require("../app");
const request = require("supertest");
const isBase64 = require("is-base64");
const { join } = require("path");

const FileImageCat = join(process.cwd(), "/public/testimages/cryingcat.png");
const UnsupportedFileImage = join(process.cwd(), "/public/testimages/cryingcat.webp");

describe("🎯 Testing (Bye Mom) API endpoint", () =>
{
    it("GET - Should return a message and a status code of (404) for GET requests", (done) =>
    {
        request(app).get("/api/v1/byemom")
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

    it("POST - Should return a message and a status code of (400) if there is no image attached", (done) =>
    {
        request(app).post("/api/v1/byemom")
        .expect("Content-Type", /json/)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("You need to provide an actual image if you want your meme, duh... 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (415) if the image is not supported", (done) =>
    {
        request(app).post("/api/v1/byemom")
        .expect("Content-Type", /json/)
        .attach("image", UnsupportedFileImage)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(415);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(415);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid file type provided. Allowed file types are: (*.JPEG, *.PNG, *.TIFF and *.BMP) 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if there is no query specified but a supported image type attached", (done) =>
    {
        request(app).post("/api/v1/byemom")
        .expect("Content-Type", /json/)
        .attach("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid search query text specified! You need to specifiy a search query text in your query parameter. Correct usage is /byemom?searchquery='your internet search query' 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if the `searchquery` is empty but a supported image type is attached", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=")
        .expect("Content-Type", /json/)
        .attach("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Invalid search query text specified! You need to specifiy a search query text in your query parameter. Correct usage is /byemom?searchquery='your internet search query' 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if the `searchquery` query length is higher than 34 characters but a supported image type is attached", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=LKdx1XY72yoFgTkXd1rXHUmnVgx3drIjwHjrQtJnpQ5pYhmKlKFl43AwxeYK8bbQCwQID6cysLxIgEnG6xaFBhz7yI33lFrFHYhu4kxSJDX5m89l1scTGykzgteYJv1i2")
        .expect("Content-Type", /json/)
        .attach("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.a("object");
            expect(Object.keys(response.body).length).to.be.equal(2);
            expect(response.body).to.have.a.property("status").and.to.be.a("number").and.to.be.equal(400);
            expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("Your search query text is too long. Maximum 34 characters please... 🙄");

            done();
        });
    });

    it("POST - Should return a message and a status code of (400) if a supported image type is attached and all queries are specified but the query `format` is not present", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=google.com")
        .expect("Content-Type", /json/)
        .attach("image", FileImageCat)
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

    it("POST - Should return a message and a status code of (400) if a supported image type is attached and all queries are specified but the `format` query contains an invalid format", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=google.com&format=nope")
        .expect("Content-Type", /json/)
        .attach("image", FileImageCat)
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

    it("POST - Should return a buffer and a status code of (200) if a supported image type is attached, all queries are specified and the `format` query is set to `buffer`", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=google.com&format=buffer")
        .attach("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(Buffer.isBuffer(response.body)).to.be.true;

            done();
        });
    });

    it("POST - Should return a base64 string of the image and a status code of (200) if a supported image type is attached, all queries are specified and the `format` query is set to `base64`", (done) =>
    {
        request(app).post("/api/v1/byemom?searchquery=github.com&format=base64")
        .attach("image", FileImageCat)
        .end((err, response) =>
        {
            expect(response.status).to.be.equal(200);
            expect(response.text).to.be.a("string").and.to.not.be.empty;
            expect(isBase64(response.text)).to.be.true;

            done();
        });
    });
});