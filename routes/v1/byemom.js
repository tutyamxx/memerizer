/* eslint-disable no-undef */

const Jimp = require('jimp');
const gm = require('gm');
const isUri = require('is-uri');
const { join } = require('path');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Bye Mom" meme
router.post('/byemom', (req, res) => {
    try {
        const imageBodyParam = req.body?.image;

        if (!imageBodyParam) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_PROVIDE_IMAGE });
        }

        if (!isUri(imageBodyParam)) {
            return res.status(415).send({ status: 415, message: APIConstants.ReturnErrorType.ERROR_INVALID_FILETYPE });
        }

        const searchQuery = req.query?.searchquery;

        if (!searchQuery || searchQuery?.length <= 0 || typeof searchQuery !== 'string') {
            return res.status(400).send({ status: 400, message: 'Invalid search query text specified! You need to specifiy a search query text in your query parameter. Correct usage is /byemom?searchquery=\'your internet search query\' 🙄' });
        }

        if (searchQuery?.length > 34) {
            return res.status(400).send({ status: 400, message: 'Your search query text is too long. Maximum 34 characters please... 🙄' });
        }

        const returnFormat = req.query?.format;

        if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
            return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
        }

        APIConstants.Image[0] = Jimp.read(imageBodyParam);
        APIConstants.Image[1] = Jimp.read(imageBodyParam);
        APIConstants.Image[2] = Jimp.read(join(__dirname, '../../public/images/byemom/byemom.png'));

        Promise.all([APIConstants.Image[0], APIConstants.Image[1], APIConstants.Image[2]]).then((images) => {
            images[0].resize(70, 70).quality(100);
            images[1].resize(125, 125).quality(100);
            images[2].composite(images[0], 532, 9).composite(images[1], 76, 326).quality(100).getBuffer(Jimp.AUTO, (err, buffer) => {
                if (err) {
                    return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Bye Mom` j ⚠️' });
                }

                gm(buffer)
                    .font(join(__dirname, '../../public/fonts/Helvetica.ttf'), 20)
                    .fill('#111111')
                    // eslint-disable-next-line no-useless-escape
                    .draw(["rotate -25 text 70, 703 '" + decodeURIComponent(searchQuery?.replace(/'/g, "`")?.replace(/\"/g, "")?.trim()) + "'"])
                    .toBuffer((err2, buffer2) => {
                        if (err2) {
                            return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Bye Mom` g ⚠️' });
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
