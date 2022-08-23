/* eslint-disable no-undef */

const Jimp = require('jimp');
const express = require('express');
const router = express.Router();

const APIConstants = require('../../lib/constants');

// --| Endpoint to "Be Like Bill" meme
router.get('/belike', (req, res) => {
    const usernameParam = req.query?.name;
    const genderParam = req.query?.gender;

    const AllowedGenderParam = ['m', 'f'];

    if (!usernameParam || usernameParam?.length <= 0 || typeof usernameParam !== 'string') {
        return res.status(400).send({ status: 400, message: 'Invalid first query specified! Correct usage is /belike?name=\'yor name here\'&gender=\'m or f\' 🙄' });
    }

    if (!genderParam || !AllowedGenderParam?.includes(genderParam?.toLowerCase())) {
        return res.status(400).send({ status: 400, message: 'Invalid second query specified! Correct usage is /belike?name=\'yor name here\'&gender=\'m or f\' 🙄' });
    }

    const returnFormat = req.query?.format;

    if (!returnFormat || !APIConstants.AcceptedreturnFormat.includes(returnFormat)) {
        return res.status(400).send({ status: 400, message: APIConstants.ReturnErrorType.ERROR_INVALID_RETURN_FORMAT });
    }

    Jimp.read(encodeURI(`https://belikebill.ga/billgen-API.php?default=1&name=${decodeURIComponent(usernameParam?.replace(/[^a-zA-Z0-9]/gi, ''))}&sex=${genderParam?.toLowerCase()}`)).then((image) => {
        image.getBuffer(Jimp.AUTO, (err, buffer) => {
            if (err) {
                return res.status(422).send({ status: 422, message: 'There was an error creating the meme \'Be Like Bill\' ⚠️' });
            }

            return returnFormat === 'buffer'
                ? res.status(200).send(buffer)
                : res.status(200).send(Buffer.from(buffer, 'base64').toString('base64'));
        });
    });
});

module.exports.router = router;
