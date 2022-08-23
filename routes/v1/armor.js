/* eslint-disable no-undef */

const gm = require('gm');
const { join } = require('path');
const wrap = require('word-wrap');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Nothing Gets Through This Armor" meme
router.get('/armor', (req, res) => {
    const meanTextQuery = req.query?.meantext;

    if (!meanTextQuery || meanTextQuery?.length <= 0 || typeof meanTextQuery !== 'string') {
        return res.status(400).send({ status: 400, message: 'Invalid query specified! You need to specifiy a mean text in your query parameter. Correct usage is /armor?meantext=\'your text here\' 🙄' });
    }

    if (meanTextQuery?.length > 100) {
        return res.status(400).send({ status: 400, message: 'Your mean text is too long. Maximum 100 characters please... 🙄' });
    }

    const returnFormat = req.query?.format;

    if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    const decodeMeanText = decodeURIComponent(meanTextQuery);
    const fontSize = (decodeMeanText?.length >= 20) ? 16 : 24;
    const formattedMeanText = decodeMeanText?.replace(/'/g, '`')?.replace(/["]/g, '')?.trim()?.toUpperCase();

    gm(join(__dirname, '../../public/images/armor/armor.png'))
        .font(join(__dirname, '../../public/fonts/Kreskowka-Regular.ttf'), fontSize)
        .fill('#111111')
        .draw(["text 0, 350 '" + wrap(formattedMeanText, { width: (formattedMeanText?.length >= 20) ? 30 : 25 }) + "'"])
        .toBuffer((err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Nothing gets through this armor` g ⚠️' });
            }

            return returnFormat === 'buffer'
                ? res.status(200).send(buffer)
                : res.status(200).send(Buffer.from(buffer, 'base64').toString('base64'));
        });
});

module.exports.router = router;
