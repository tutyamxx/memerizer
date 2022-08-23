/* eslint-disable no-undef */

const gm = require('gm');
const { join } = require('path');
const wrap = require('word-wrap');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Cold Hard Truth" meme
router.get('/truth', (req, res) => {
    const truthTextQuery = req.query?.text;

    if (!truthTextQuery || truthTextQuery?.length <= 0 || typeof truthTextQuery !== 'string') {
        return res.status(400).send({ status: 400, message: 'Invalid text query specified! You need to specifiy a text in your query parameter. Correct usage is /truth?text=\'your cold hard truth here\' 🙄' });
    }

    if (truthTextQuery?.length > 158) {
        return res.status(400).send({ status: 400, message: 'Your text is too long. Maximum 158 characters please... 🙄' });
    }

    const returnFormat = req.query?.format;

    if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    const fontSize = (truthTextQuery?.length >= 50) ? 16 : 22;
    const formattedText = truthTextQuery?.replace(/'/g, '`')?.replace(/["]/g, '')?.trim();

    gm(join(__dirname, '../../public/images/truth/truth.jpg'))
        .font(join(__dirname, '../../public/fonts/MangaSpeak.ttf'), fontSize)
        .fill('#111111')
        .draw(["text 0, 193 '" + wrap(formattedText, { width: (formattedText?.length >= 50) ? 21 : 15 }) + "'"])
        .toBuffer((err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme `Cold Hard Truth` ⚠️' });
            }

            return returnFormat === 'buffer'
                ? res.status(200).send(buffer)
                : res.status(200).send(Buffer.from(buffer, 'base64').toString('base64'));
        });
});

module.exports.router = router;
