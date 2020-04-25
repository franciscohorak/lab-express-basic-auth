const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10; // Number of times bcrypt algorithm will run. 10 is the most common

const User = require('../models/User'); //calling the User Module so that we can use in the routes.js

router.get('/signup', (req, res, next) => { //SignUp Page - Basic Routes
    try {
        res.render('auth/signup');
    } catch (e) {
        next(e);
    }
});
router.get('/login', (req, res, next) => { //LogIn Page - Basic Routes 
    try {
        res.render('auth/login');
    } catch (e) {
        next(e);
    }
});

//SIGN UP

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt)

    if (username === "" || password === "") { // to make sure both fields are filled in in order to store a new user in the data base 
        res.render('auth/signup', {
            errorMessage: "Please indicate an username and a password"
        })
        return;
    }
    User.findOne({
            "username": username
        })
        .then(user => {
            if (user) {
                console.log('found user')
                res.render("auth/signup", {
                    errorMessage: "The username already exists"
                })
                return;
            }
            User.create({
                    username,
                    password: hashPass,
                })
                .then(() => {
                    res.redirect("/")
                }).catch(error => {
                    next(error);
                })
        })
})

//LOGIN

router.post('/login', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    //TODO add fallbacks
    if (!username || !password) {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to login"
        })
        return
    }
    User.findOne({
            'username': username
        })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "The username doesn't exist"
                })
                return
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect("/");
            } else {
                res.render("auth/login", {
                    errorMessage: "Incorrect Password"
                })
            }
        })
})


//-------------------------------------------------------------->LOG OUT  ROUTER 
router.get('/logout', (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;

