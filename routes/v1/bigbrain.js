/* eslint-disable no-undef */

const Jimp = require('jimp');
const isUri = require('is-uri');
const gm = require('gm');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Big Brain Time" meme
router.post('/bigbrain', async (req, res) => {
    try {
        const imageBodyParam = req.body?.image;

        if (!imageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(imageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const returnFormat = req.query?.format;

        if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        APIConstants.Image[0] = await Jimp.read(imageBodyParam).catch((err) => {
            if (err) {
                return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
            }
        });

        APIConstants.Image[0].getBuffer(Jimp.AUTO, (err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Big Brain Time` j ⚠️' });
            }

            gm(buffer).implode(-2.9).autoOrient().toBuffer((err2, buffer2) => {
                if (err2) {
                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Big Brain Time` g ⚠️' });
                }

                return returnFormat === 'buffer'
                    ? res.status(200).send(buffer2)
                    : res.status(200).send(Buffer.from(buffer2, 'base64').toString('base64'));
            });
        });
    // eslint-disable-next-line no-empty
    } catch (err) { }
});

module.exports.router = router;
