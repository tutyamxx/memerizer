const Jimp = require("jimp");
const { join } = require("path");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "R.I.P Tombstone" meme
router.post("/rip", (req, res, next) =>
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

        const szUsernameParam = req.query.name;

        if(!szUsernameParam || szUsernameParam.length <= 0 || typeof szUsernameParam !== "string")
        {
            return res.status(400).send({ status: 400, message: "Invalid first query specified! Correct usage is /rip?name='yor name here' 🙄" });
        }

        const ReturnFormat = req.query.format;

        if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        const DecancerifiedUsername = szUsernameParam.replace(/[^a-zA-Z0-9À-ž_ -]/g, "");

        Jimp.read(join(__dirname, "../../public/images/rip/rip.png")).then((image) =>
        {
            Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) =>
            {
                const totalWidth = Jimp.measureText(font, DecancerifiedUsername);

                Jimp.read(UploadedPicture.data).then((image2) =>
                {
                    image2.resize(70, 70).greyscale();
                    image.print(font, Math.floor(image.bitmap.width / 2 - totalWidth / 2), 160, DecancerifiedUsername).composite(image2, (image.bitmap.width / 2) - 37, 190).getBuffer(Jimp.MIME_PNG, (err, buffer) =>
                    {
                        if(err)
                        {
                            return res.status(422).send({ status: 422, message: "There was an error creating the meme `R.I.P Tombstone` ⚠️" });
                        }

                        return ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
                    });
                });
            });
        });
    }

    catch(err)
    {
        return res.status(500).send({ status: 500, message: err.message });
    }
});

module.exports.router = router;