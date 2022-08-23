const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// --| Default API endpoint. Check if is working :)
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => res.status(200).json({
    status: 200,
    message: 'I don\'t always access endpoints, but when I do, I get a 200 status 🤘🏽🤪🤘🏽'
}));

// --| Routing for POST endpoints
router.post('/beautiful', require('./beautiful.js').router);
router.post('/wdt', require('./wdt.js').router);
router.post('/wanted', require('./wanted.js').router);
router.post('/trapcard', require('./trapcard.js').router);
router.post('/trash', require('./trash.js').router);
router.post('/rip', require('./rip.js').router);
router.post('/pride', require('./pride.js').router);
router.post('/pixel', require('./pixel.js').router);
router.post('/loser', require('./loser.js').router);
router.post('/needsmorejpeg', require('./needsmorejpeg.js').router);
router.post('/jail', require('./jail.js').router);
router.post('/disabled', require('./disabled.js').router);
router.post('/dogpoop', require('./dogpoop.js').router);
router.post('/worsethan', require('./worsethan.js').router);
router.post('/fool', require('./fool.js').router);
router.post('/bigbrain', require('./bigbrain.js').router);
router.post('/draw', require('./draw.js').router);
router.post('/byemom', require('./byemom.js').router);
router.post('/changemymind', require('./changemymind.js').router);
router.post('/deepfry', require('./deepfry.js').router);
router.post('/circle', require('./circle.js').router);
router.post('/spongeburn', require('./spongeburn.js').router);
router.post('/emboss', require('./emboss.js').router);
router.post('/glitch', require('./glitch.js').router);
router.post('/missionpassed', require('./missionpassed.js').router);
router.post('/frame', require('./frame.js').router);
router.post('/blur', require('./blur.js').router);

// --| Routing for GET endpoints
router.get('/belike', require('./belike.js').router);
router.get('/armor', require('./armor.js').router);
router.get('/truth', require('./truth.js').router);
router.get('/eww', require('./eww.js').router);

module.exports.router = router;
