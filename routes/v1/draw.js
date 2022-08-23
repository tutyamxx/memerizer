/* eslint-disable no-undef */

const gm = require('gm');
const Jimp = require('jimp');
const isUri = require('is-uri');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Draw" meme
router.post('/draw', async (req, res) => {
    try {
        const ImageBodyParam = req.body?.image;

        if (!ImageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(ImageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
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
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Draw` j ⚠️' });
            }

            gm(buffer).border(1, 1).borderColor('black').charcoal(0.1).coalesce().despeckle().autoOrient().toBuffer((err2, buffer2) => {
                if (err2) {
                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Draw` g ⚠️' });
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
