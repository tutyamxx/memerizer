const Jimp = require("jimp");
const express = require("express");
const router = express.Router();

const APIConstants = require("../../lib/constants");

// --| Endpoint to "Be Like Bill" meme
router.get("/belike", (req, res, next) =>
{
    const szUsernameParam = req.query.name;
    const szGenderParam = req.query.gender;

    const AllowedGenderParam = [ "m", "f" ];

    if(!szUsernameParam || szUsernameParam.length <= 0 || typeof szUsernameParam !== "string")
    {
        return res.status(400).send({ status: 400, message: "Invalid first query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄" });
    }

    if(!szGenderParam || !AllowedGenderParam.includes(szGenderParam.toLowerCase()))
    {
        return res.status(400).send({ status: 400, message: "Invalid second query specified! Correct usage is /belike?name='yor name here'&gender='m or f' 🙄" });
    }

    const ReturnFormat = req.query.format;

    if(!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat))
    {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    Jimp.read(encodeURI(`https://belikebill.ga/billgen-API.php?default=1&name=${decodeURI(szUsernameParam.replace(/[^a-zA-Z0-9]/gi, ""))}&sex=${szGenderParam.toLowerCase()}`)).then((image) =>
    {
        image.getBuffer(Jimp.AUTO, (err, buffer) =>
        {
            if(err)
            {
                return res.status(422).send({ status: 422, message: "There was an error creating the meme 'Be Like Bill' ⚠️" });
            }

            return ReturnFormat === "buffer" ? res.status(200).send(buffer) : res.status(200).send(Buffer.from(buffer, "base64").toString("base64"));
        });
    });
});

module.exports.router = router;