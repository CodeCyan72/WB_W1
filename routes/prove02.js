//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/prove02', { 
        title: 'Prove Assignment 02', 
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.post('/',(req, res, next) => {
    // read from file
    let rawdata = fs.readFileSync('./records.json');
    let records = JSON.parse(rawdata);
    //add record
    records[req.body.title] = req.body.desc;

    //write to the file
    let data = JSON.stringify(records);
    fs.writeFileSync('./records.json', data);

    res.render('pages/displayprove02', { 
        title: 'Display',
        records: records,
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

module.exports = router;