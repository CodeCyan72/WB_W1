const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password.');
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
        if (userDoc) { 
            req.flash('error', 'E-Mail exists already, please pick a different one.');
            return res.redirect('auth/signup');
        }
        //If one exists already of that kind
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
