//TA03 PLACEHOLDER
const items = require('../data/items.json');
const ITEMS_PER_PAGE = 10;

const unique_tags = [];
for (let item of items){
    for (let tag of item.tags){
        unique_tags.push(tag);
    }
}

const uniqueValues = [...new Set(unique_tags)];  

exports.get08 = ('/',(req, res, next) => {
    // console.log(uniqueValues)
    res.render('pages/prove08', { 
        title: 'Prove Assignment 08', 
        path: '/prove08', // For pug, EJS 
        uniqueValues: uniqueValues,
        items: items.slice(0, ITEMS_PER_PAGE),   
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        numPages: Math.ceil(items.length / ITEMS_PER_PAGE),
    });
});

exports.post08 = ('/',(req, res, next) => {
    // let value = req.body.category;
    // const result = items.filter(item => item.tags.includes(value));

    res.render('pages/prove08', { 
        title: 'Prove Assignment 08', 
        path: '/prove08', // For pug, EJS 
        uniqueValues: uniqueValues,
        items: items.slice((req.body.page-1)*ITEMS_PER_PAGE, req.body.page*ITEMS_PER_PAGE), 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        numPages: Math.ceil(items.length / ITEMS_PER_PAGE),
    });
});
