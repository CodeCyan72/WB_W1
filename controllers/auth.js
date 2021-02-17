const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { validationResult } = require('express-validator/check')

// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const { compileClient } = require('pug');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: '....................................'
//     }
// }));

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {email: "", password: "", confirmPassword: ''},
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // if there are errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,   
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            //If we don't find a user with that email
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email,
                        password: password,   
                    },
                    validationErrors: []
                });
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
                .catch(err => {
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password,   
                        },
                        validationErrors: []
                    });
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {email: email, password: password, confirmPassword: confirmPassword},
            validationErrors: errors.array()
        });
    }

    //If one exists already of that kind
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            // create a new user if one does not exist
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/auth/login')
            return transporter.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/shop');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('auth/reset');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/auth/reset');
                }

                //make a reset token
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                //
                res.redirect('/shop');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Password Reset Link',
                    html: `
                <p> You requested a password reset link </p>
                <p>Click this <a href="http://localhost:5000/reset/${token}">LINK</a> to get a new password </p>
                `
                });
            })
            .catch(err => {
                console.log(err)
            });
    })
};

exports.getNewPassword = (req, res, next) => {
    const toekn = req.params.token;
    User.find({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })

};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    const resetUser =

        User.findOne({
            resetToken: passwordToken,
            passwordTokenExpiration: { $gt: Date.now() },
            _id: userId
        })
            .then(user => {
                resetUser = user;
                return bcrypt.hashedPassword(newPassword, 12);
            })
            .then(hashedPassword => {
                resetUser.password = hashedPassword;
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            })
            .then(result => {
                res.redirect('/shop');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
};