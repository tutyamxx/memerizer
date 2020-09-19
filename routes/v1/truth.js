const gm = require("gm");
const { join } = require("path");
const wrap = require("word-wrap");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "Cold Hard Truth" meme
router.get("/truth", (req, res, next) =>
{
    const szTruthText = req.query.text;

    if(!szTruthText || szTruthText.length <= 0 || typeof szTruthText !== "string")
    {
        return res.status(400).send({ status: 400, message: "Invalid text query specified! You need to specifiy a text in your query parameter. Correct usage is /truth?text='your cold hard truth here' 🙄" });
    }

    if(szTruthText.length > 158)
    {
        return res.status(400).send({ status: 400, message: "Your text is too long. Maximum 158 characters please... 🙄" });
    }

    const ReturnFormat = req.query.format;

    if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
    {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    const FontSize = (szTruthText.length >= 50) ? 16 : 22;
    const FormattedText = szTruthText.replace(/'/g, "`").replace(/["]/g, "").trim();

    gm(join(__dirname, "../../public/images/truth/truth.jpg"))
    .font(join(__dirname, "../../public/fonts/MangaSpeak.ttf"), FontSize)
    .fill("#111111")
    .draw(["text 0, 193 '" + wrap(FormattedText, { width: (FormattedText.length >= 50) ? 21 : 15 }) + "'"])
    .toBuffer((err, buffer) =>
    {
        if(err)
        {
            return res.status(422).send({ status: 422, message: "There was an error creating the meme `Cold Hard Truth` ⚠️" });
        }

        return ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
    });
});

module.exports.router = router;