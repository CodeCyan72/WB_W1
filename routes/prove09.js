//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

const pController = require('../controllers/prove09');

router.get('/',pController.get09);

module.exports = router;