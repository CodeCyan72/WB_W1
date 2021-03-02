//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

const pController = require('../controllers/prove08');


router.get('/',pController.get08);

router.post('/',pController.post08);


module.exports = router;