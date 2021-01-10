//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/prove01', { 
        title: 'Prove Assignment 01', 
        path: '/prove01', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.post('/',(req, res, next) => {
    res.render('pages/displayprove01', { 
        title: 'Display', 
        path: '/prove01', // For pug, EJS 
        firstName: req.body.first,
        lastName: req.body.last,
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

module.exports = router;