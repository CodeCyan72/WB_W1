//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();

const users = [];
router.post('/addUser',(req, res, next) => {
    for (let user of users) {
        if (user === req.body.username) {
            console.log("Inside the if");
            res.write("<p>The user " + req.body.username + " already exist!</p>");
            return res.end();
        }
    }
    users.push(req.body.username);

    res.render('pages/ta02', { 
        title: 'Team Activity 02', 
        path: '/ta02', // For pug, EJS 
        users: users
    });
});

router.post('/removeUser',(req, res, next) => {
    let userExist = false;

    for (var i = 0; i < users.length; i++) { 
        if (users[i] === req.body.removeUsername) { 
            users.splice(i, 1); 
            userExist = true;
        }
    }
    
    if (!userExist) {
        res.write("<p>The user " + req.body.removeUsername + " doesn't exist!</p>");
        return res.end();
    }

    res.render('pages/ta02', { 
        title: 'Team Activity 02', 
        path: '/ta02', // For pug, EJS 
        userExist: userExist,
        users: users
    });
});

router.get('/',(req, res, next) => {
    let errorMessage = '';
    res.render('pages/ta02', { 
        title: 'Team Activity 02', 
        path: '/ta02', // For pug, EJS 
        users: users
    });
});

module.exports = router;