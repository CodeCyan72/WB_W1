const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            return res.redirect('/auth/login')
        }
        
        //check password
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/shop');
                    // return res.redirect('/shop');
                });
            }
            res.redirect('/auth/login');
        })
        .catch(err=>{
            console.log(err);
            res.redirect('/auth/login');
        });
        // req.session.isLoggedIn = true;
        // req.session.user = user;
        // req.session.save(err => {
        //     console.log(err);
        //     res.redirect('/shop');
        // });
    })
    .catch(err => console.log(err));

    // res.setHeader('Set-Cookie', 'loggedIn=true; HTTPOnly');
    // User.findById('6019df733e085416f844fe81')
    //     .then(user => {
    //         req.session.isLoggedIn = true;
    //         req.session.user = user;
    //         req.session.save(err => {
    //             console.log(err);
    //             res.redirect('/shop');
    //         });
    //     })
    //     .catch(err => console.log(err));
};


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //No duplicate emails
    User.findOne({email: email}).then(userDoc => {
        //If one exists already of that kind
        if (userDoc) { 
            return res.redirect('auth/signup');
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
            // create a new user if one does not exist
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        });

    }).then(result => {
        res.redirect('/auth/login')
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/shop');
    });
};
