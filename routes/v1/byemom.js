const Jimp = require("jimp");
const gm = require("gm").subClass({ imageMagick: true });
const isUri = require("is-uri");
const { join } = require("path");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "Bye Mom" meme
router.post("/byemom", (req, res, next) =>
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

        const szSearchQuery = req.query.searchquery;

        if(!szSearchQuery || szSearchQuery.length <= 0 || typeof szSearchQuery !== "string")
        {
            return res.status(400).send({ status: 400, message: "Invalid search query text specified! You need to specifiy a search query text in your query parameter. Correct usage is /byemom?searchquery='your internet search query' 🙄" });
        }

        if(szSearchQuery.length > 34)
        {
            return res.status(400).send({ status: 400, message: "Your search query text is too long. Maximum 34 characters please... 🙄" });
        }

        const ReturnFormat = req.query.format;

        if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
        {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        let Image1 = Jimp.read(ImageBodyParam);
        let Image2 = Jimp.read(ImageBodyParam);
        let Image3 = Jimp.read(join(__dirname, "../../public/images/byemom/byemom.png"));

        Promise.all([Image1, Image2, Image3]).then((images) =>
        {
            images[0].resize(70, 70).quality(100);
            images[1].resize(125, 125).quality(100);

            images[2].composite(images[0], 532, 9).composite(images[1], 76, 326).quality(100).getBuffer(Jimp.MIME_PNG, (err, buffer) =>
            {
                if(err)
                {
                    return res.status(422).send({ status: 422, message: "There was an error creating the meme `Bye Mom` j ⚠️" });
                }

                gm(buffer)
                .font(join(__dirname, "../../public/fonts/Helvetica.ttf"), 20)
                .fill("#111111")
                .draw(["rotate -25 text 70, 703 '" + decodeURI(szSearchQuery.replace(/'/g, "`").replace(/\"/g, "").trim()) + "'"])
                .toBuffer("byemom.png", (err, buffer2) =>
                {
                    if(err)
                    {
                        return res.status(422).send({ status: 422, message: "There was an error creating the meme `Bye Mom` g ⚠️" });
                    }

                    return ReturnFormat === "buffer" ? res.status(200).send(buffer2) : res.status(200).send(Buffer.from(buffer2, "base64").toString("base64"));
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