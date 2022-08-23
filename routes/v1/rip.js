/* eslint-disable no-undef */

const Jimp = require('jimp');
const isUri = require('is-uri');
const { join } = require('path');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "R.I.P Tombstone" meme
router.post('/rip', (req, res) => {
    try {
        const imageBodyParam = req.body?.image;

        if (!imageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(imageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const usernameParam = req.query?.name;

        if (!usernameParam || usernameParam?.length <= 0 || typeof usernameParam !== 'string') {
            return res.status(400).send({ status: 400, message: 'Invalid first query specified! Correct usage is /rip?name=\'yor name here\' 🙄' });
        }

        const returnFormat = req.query?.format;

        if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        const decancerifiedUsername = usernameParam?.replace(/[^a-zA-Z0-9À-ž_ -]/g, '');

        Jimp.read(join(__dirname, '../../public/images/rip/rip.png')).then((image) => {
            Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
                const totalWidth = Jimp.measureText(font, decancerifiedUsername);

                Jimp.read(imageBodyParam).then((image2) => {
                    image2.resize(70, 70).greyscale();
                    image.print(font, Math.floor(image.bitmap.width / 2 - totalWidth / 2), 160, decancerifiedUsername)
                        .composite(image2, (image.bitmap.width / 2) - 37, 190).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                            if (err) {
                                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `R.I.P Tombstone` ⚠️' });
                            }

                            return returnFormat === 'buffer'
                                ? res.status(200).send(buffer)
                                : res.status(200).send(Buffer.from(buffer, 'base64').toString('base64'));
                        });
                }).catch((err) => {
                    if (err) {
                        return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
                    }
                });
            });
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
});

module.exports.router = router;
