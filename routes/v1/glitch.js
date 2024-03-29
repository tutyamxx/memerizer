/* eslint-disable no-undef */

const Jimp = require('jimp');
const glitch = require('glitch-canvas');
const isUri = require('is-uri');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Glitch" meme
router.post('/glitch', async (req, res) => {
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
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Glitch` ⚠️' });
            }

            glitch({ seed: 25, quality: 30, amount: 35 }).fromBuffer(buffer).toBuffer().then((glitchedbuffer) => returnFormat === 'buffer'
                ? res.status(200).send(glitchedbuffer)
                : res.status(200).send(Buffer.from(glitchedbuffer, 'base64').toString('base64'))
            ).catch(() => res.status(422).send({ status: 422, message: 'There was an error creating the meme `Glitch` ⚠️' }));
        });
    // eslint-disable-next-line no-empty
    } catch (err) { }
});

module.exports.router = router;
