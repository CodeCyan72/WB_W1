const ITEMS_PER_PAGE = 10;


exports.get09 = ('/', (req, res, next) => {
    // console.log(uniqueValues)
    res.render('pages/prove09', { 
        title: 'Prove Assignment 09', 
        path: '/prove09', // For pug, EJS 
        // items: items.slice(0, ITEMS_PER_PAGE),   
        // activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
});