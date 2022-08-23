/* eslint-disable no-undef */

const Jimp = require('jimp');
const gm = require('gm');
const isUri = require('is-uri');
const { join } = require('path');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Change My Mind" meme
router.post('/changemymind', (req, res) => {
    try {
        const imageBodyParam = req.body?.image;

        if (!imageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(imageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const opinionTextQuery = req.query?.opinion;

        if (!opinionTextQuery || opinionTextQuery?.length <= 0 || typeof opinionTextQuery !== 'string') {
            return res.status(400).send({ status: 400, message: 'Invalid opinion query specified! You need to specifiy a text in your query parameter. Correct usage is /changemymind?opinion=\'your opinion here\' 🙄' });
        }

        if (opinionTextQuery?.length > 27) {
            return res.status(400).send({ status: 400, message: 'Your opinion text is too long. Maximum 27 characters please... 🙄' });
        }

        const returnFormat = req.query?.format;

        if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        APIConstants.Image[0] = Jimp.read(imageBodyParam);
        APIConstants.Image[1] = Jimp.read(join(__dirname, '../../public/images/changemymind/changemymind.jpg'));

        Promise.all([APIConstants.Image[0], APIConstants.Image[1]]).then((images) => {
            images[0].resize(40, 40).rotate(9);
            images[1].composite(images[0], 175, 43).quality(100).getBuffer(Jimp.AUTO, (err, buffer) => {
                if (err) {
                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Change My Mind` j ⚠️' });
                }

                gm(buffer)
                    .font(join(__dirname, '../../public/fonts/Helvetica.ttf'), 14)
                    .fill('#111111')
                    .draw(["rotate -7 text 195, 290 '" + decodeURIComponent(opinionTextQuery?.replace(/'/g, "`")?.replace(/["]/g, "")?.trim()) + "'"])
                    .toBuffer((err2, buffer2) => {
                        if (err) {
                            return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Change My Mind` g ⚠️' });
                        }

                        return returnFormat === 'buffer'
                            ? res.status(200).send(buffer2)
                            : res.status(200).send(Buffer.from(buffer2, 'base64').toString('base64'));
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
