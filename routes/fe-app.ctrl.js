let express = require('express');
let router = express.Router();

// use session auth to secure the angular app files
router.use('*', function(req, res) { //passport.authenticate('jwt', { session: false}),
    res.sendFile('./app/dist/index.html', {root: './public'}); //ng2  '../public' to launch from nodejs
});

module.exports = router;