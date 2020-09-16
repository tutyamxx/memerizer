const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const https = require("https");
const rateLimit = require("express-rate-limit");
const favicon = require("serve-favicon");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");

const memesRoutes = require("./routes/v1/routes");
const port = process.env.PORT || 6969;

let app = express();

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// --| Enable CORS for all requests
app.use(cors());

// --| Enable Helmet to secure the API a bit
app.use(helmet());

// --| Need this set for Heroku
app.set("trust proxy", 1);

// --| Limit the API for 50 requests per IP every minute
const APILimiter = rateLimit(
{
    windowMs: 60000,
    max: 65,
    skipFailedRequests: true,
    message:
    {
        status: 429,
        message: "Too many requests! Stop spamming 😡"
    }
});

app.use(fileUpload(
{
    createParentPath: true
}));

app.use("/api/", APILimiter);
app.use("/api/v1", memesRoutes.router);

// --| 404 Response
app.use((req, res, next) =>
{
    res.status(404).json({ status: 404, message: "Sorry, can't access the endpoint you are looking for 👀. Is it POST or GET 🤔 ?" });
});

// --| Log the info on server startup
app.listen(port, () => console.log(`🖥️  Server runs and is listening on port \x1b[34m${port}\x1b[0m.`));

// --| Ping Heroku app and prevent it from sleeping every 15 minutes
setInterval(() =>
{
    https.get("https://memerizer.herokuapp.com/api/v1");

}, 900000);

module.exports = app;