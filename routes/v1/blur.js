/* eslint-disable no-undef */

const gm = require('gm');
const Jimp = require('jimp');
const isUri = require('is-uri');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Blur" meme
router.post('/blur', async (req, res) => {
    try {
        const ImageBodyParam = req.body?.image;

        if (!ImageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(ImageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const iBlurRadius = req.query?.radius;

        if (!iBlurRadius || isNaN(iBlurRadius)) {
            return res.status(400).send({ status: 400, message: 'Invalid radius query specified! It has to be a number! Correct usage is /blur?radius=15 🙄' });
        }

        const ReturnFormat = req.query?.format;

        if (!ReturnFormat || !APIConstants.AcceptedReturnFormat.includes(ReturnFormat)) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        APIConstants.Image[0] = await Jimp.read(ImageBodyParam).catch((err) => {
            if (err) {
                return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
            }
        });

        APIConstants.Image[0].getBuffer(Jimp.AUTO, (err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Blur` j ⚠️' });
            }

            gm(buffer).blur((parseInt(iBlurRadius) > 100) ? 100 : parseInt(iBlurRadius), 20).toBuffer((err2, buffer2) => {
                if (err2) {
                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Blur` g ⚠️' });
                }

                return ReturnFormat === 'buffer'
                    ? res.status(200).send(buffer2)
                    : res.status(200).send(Buffer.from(buffer2, 'base64').toString('base64'));
            });
        });
    // eslint-disable-next-line no-empty
    } catch (err) { }
});

module.exports.router = router;
