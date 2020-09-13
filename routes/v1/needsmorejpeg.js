const Jimp = require("jimp");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "Needs more JPEG" meme
router.post("/needsmorejpeg", async (req, res, next) =>
{
    try
    {
        if(!req.files)
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        const UploadedPicture = req.files.image;

        if(req.files && !APIConstants.AcceptedImageTypes.includes(req.files.image.mimetype))
        {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const ReturnFormat = req.query.format;

        if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        let Image1 = await Jimp.read(UploadedPicture.data);
        Image1.quality(1).getBuffer(Jimp.MIME_JPEG, (err, buffer) =>
        {
            if(err)
            {
                return res.status(422).send({ status: 422, message: "There was an error creating the meme `Needs more JPEG` ⚠️" });
            }

            return ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
        });
    }

    catch(err)
    {
        return res.status(500).send({ status: 500, message: err.message });
    }
});

module.exports.router = router;