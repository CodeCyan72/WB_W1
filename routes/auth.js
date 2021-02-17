// const path = require('path');
const express = require('express');
const { check, body } = require('express-validator/check');

const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login',
            [
                body("email").isEmail().withMessage("Please enter a valid email address.").normalizeEmail(),
                body('password').isLength({min:8}).withMessage("Password must be 8 characters long.").trim()
            ], 
            authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', 
            check('email').isEmail().withMessage("Please enter a valid email.")
            .custom((value, {req}) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already exists. Please pick a different one.')
                    }
                })
            }).normalizeEmail(),
            body('password', 'Password must be 8 characters ').isLength({min: 8}).isAlphanumeric().trim(),
            body('confirmPassword').custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Password must match!');
                }
                return true;
            }).trim(),
            authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;