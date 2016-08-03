'use strict';
var router = require('express').Router();
module.exports = router;


router.use('/members', require('./members'));
router.use('/products', require('./api/product.js'));
router.use('/orders', require('./api/order.js'));
router.use('/user', require('./api/users.js'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
