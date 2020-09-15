const Jimp = require("jimp");
const isUri = require("is-uri");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "Emboss" meme
router.post("/emboss", async (req, res, next) =>
{
    try
    {
        const ImageBodyParam = req.body.image;

        if(!ImageBodyParam)
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if(!isUri(ImageBodyParam))
        {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const ReturnFormat = req.query.format;

        if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        APIConstants.Image[0] = await Jimp.read(ImageBodyParam).catch(err =>
        {
            if(err)
            {
                return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
            }
        });

        APIConstants.Image[0].convolute([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]]).getBuffer(Jimp.AUTO, (err, buffer) =>
        {
            if(err)
            {
                return res.status(422).send({ status: 422, message: "There was an error creating the meme `Emboss` ⚠️" });
            }

            return ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
        });
    }

    catch(err) { }
});

module.exports.router = router;