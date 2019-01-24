const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Profile = require('../models/profile');
const multer             = require('multer');

const upload = multer({dest : "./public/uploads"});

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login', { message: req.flash('error') });
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup', { message: req.flash('error') });
});

router.post('/signup', upload.single('profile'), ensureLoggedOut(), (req, res, next) => {
    //TODO: Ver si aquí todo bien
    const profile = new Profile({
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        username : req.body.username
    });

    profile
        .save()
        .then(() => console.log("Uploaded image!"))
        .catch(err => console.log(err));

    next();
}, passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
    res.render('authentication/profile', {
        user: req.user
    });
});

router.get('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
