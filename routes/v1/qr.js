const Jimp = require("jimp");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "QR Generator" meme
router.get("/qr", (req, res, next) =>
{
    const szTextInQR = req.query.text;

    if(!szTextInQR || szTextInQR.length <= 0 || typeof szTextInQR !== "string")
    {
        return res.status(400).send({ status: 400, message: "Invalid text query specified! Correct usage is /qr?text='your text here' 🙄" });
    }

    const ReturnFormat = req.query.format;

    if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
    {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    Jimp.read(encodeURI(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&bgcolor=${(Math.random() * 0xFFFFFF << 0).toString(16)}&data=${szTextInQR}`)).then((image) =>
    {
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) =>
        {
            if(err)
            {
                return res.status(422).send({ status: 422, message: "There was an error creating the meme 'QR Generator' ⚠️" });
            }

            ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
        });
    });
});

module.exports.router = router;