//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

const items = require('../data/items.json');

const unique_tags = [];
for (let item of items){
    for (let tag of item.tags){
        unique_tags.push(tag)
    }
}

const uniqueValues = [...new Set(unique_tags)];  

router.get('/',(req, res, next) => {
console.log(uniqueValues)
    res.render('pages/ta03', { 
        title: 'Team Activity 03', 
        path: '/ta03', // For pug, EJS 
        uniqueValues: uniqueValues,
        items: items,   
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.post('/',(req, res, next) => {
    let value = req.body.category;
    const result = items.filter(item => item.tags.includes(value));

    res.render('pages/ta03', { 
        title: 'Team Activity 03', 
        path: '/ta03', // For pug, EJS 
        uniqueValues: uniqueValues,
        items: result,   
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});


module.exports = router;