/* eslint-disable no-undef */

const gm = require('gm');
const { join } = require('path');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Eww I Stepped in Shit" meme
router.get('/eww', (req, res) => {
    const nameQuery = req.query?.name;

    if (!nameQuery || nameQuery?.length <= 0 || typeof nameQuery !== 'string') {
        return res.status(400).send({ status: 400, message: 'Invalid name query specified! You need to specifiy a name in your query parameter. Correct usage is /eww?name=\'your shitty name\' 🙄' });
    }

    const returnFormat = req.query?.format;

    if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    const fontSize = (nameQuery.length >= 20) ? 14 : 20;

    gm(join(__dirname, '../../public/images/eww/eww.png'))
        .font(join(__dirname, '../../public/fonts/Helvetica.ttf'), fontSize)
        .fill('#111111')
        .draw(["rotate -55 text -430, 480 '" + decodeURIComponent(nameQuery?.replace(/'/g, "`")?.replace(/["]/g, "")?.trim()) + "'"])
        .toBuffer((err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Eww I Stepped in Shit` g ⚠️' });
            }

            return returnFormat === 'buffer'
                ? res.status(200).send(buffer)
                : res.status(200).send(Buffer.from(buffer, 'base64').toString('base64'));
        });
});

module.exports.router = router;
