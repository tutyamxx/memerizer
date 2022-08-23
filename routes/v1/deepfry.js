/* eslint-disable no-undef */

const Jimp = require('jimp');
const gm = require('gm');
const { join } = require('path');
const isUri = require('is-uri');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Deepfry" meme
router.post('/deepfry', (req, res) => {
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

        APIConstants.Image[0] = Jimp.read(imageBodyParam);
        APIConstants.Image[1] = Jimp.read(join(__dirname, '../../public/images/deepfry/okhand.png'));
        APIConstants.Image[2] = Jimp.read(join(__dirname, '../../public/images/deepfry/100emoji.png'));
        APIConstants.Image[3] = Jimp.read(join(__dirname, '../../public/images/deepfry/laughingemoji.png'));
        APIConstants.Image[4] = Jimp.read(join(__dirname, '../../public/images/deepfry/fireemoji.png'));
        APIConstants.Image[5] = Jimp.read(join(__dirname, '../../public/images/deepfry/cry.png'));

        const iRandomDesaturation = [0, 5, 0, 70, 100, 0, 3];
        const iRandomPosterize = [5, 8];
        const iRandomInvert = Math.floor(Math.random() * 6);

        Promise.all([APIConstants.Image[0], APIConstants.Image[1], APIConstants.Image[2], APIConstants.Image[3], APIConstants.Image[4], APIConstants.Image[5]]).then((images) => {
            images[0].resize(400, 400).dither565().normalize().opaque();

            images[1].resize(70, Jimp.AUTO).rotate(Math.floor(Math.random() * 360) + 1);
            images[2].resize(80, Jimp.AUTO).rotate(Math.floor(Math.random() * 360) + 1);
            images[3].resize(100, Jimp.AUTO).rotate(Math.floor(Math.random() * 360) + 1);
            images[4].resize(Math.floor(Math.random() * 75) + 50, Jimp.AUTO).rotate(Math.floor(Math.random() * 360) + 1);
            images[5].resize(30, Jimp.AUTO).rotate(Math.floor(Math.random() * 360) + 1);

            images[0].composite(images[1], Math.floor(Math.random() * 70) + 10, 30)
                .composite(images[2], 280, 33).composite(images[3], 28, 270).composite(images[4], 269, 250).composite(images[5], 230, 196)
                .color([{ apply: 'desaturate', params: [iRandomDesaturation[Math.floor(Math.random() * iRandomDesaturation.length)]] }])
                .posterize(iRandomPosterize[Math.floor(Math.random() * iRandomPosterize.length)])
                .quality(100).getBuffer(Jimp.AUTO, (err, buffer) => {
                    if (err) {
                        return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Deepfry` j ⚠️' });
                    }

                    gm(buffer).noise('impulse').sharpen(3, 3).toBuffer(async (err2, buffer2) => {
                        if (err2) {
                            return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Deepfry` g1 ⚠️' });
                        }

                        if (iRandomInvert === 1) {
                            const friedImage = await Jimp.read(buffer2);

                            friedImage.invert().getBuffer(Jimp.AUTO, (err3, buffer3) => {
                                if (err3) {
                                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Deepfry` g2 ⚠️' });
                                }

                                return returnFormat === 'buffer'
                                    ? res.status(200).send(buffer3)
                                    : res.status(200).send(Buffer.from(buffer3, 'base64').toString('base64'));
                            });
                        } else {
                            return returnFormat === 'buffer'
                                ? res.status(200).send(buffer2)
                                : res.status(200).send(Buffer.from(buffer2, 'base64').toString('base64'));
                        }
                    });
                });
        }).catch((err) => {
            if (err) {
                return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
            }
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
});

module.exports.router = router;
