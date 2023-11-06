const express = require('express');
const router = express.Router();
const User = require("../models/user.js"); //requiring signup model
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js");

//-----------------------------  For SignUp  ---------------------------------

//combined the SIGNUP FORM Route and SIGNUP route.
router.route("/signup")
    .get(userController.renderSignupForm) // signup form route
    .post(wrapAsync(userController.signup)) // sign route :Access the data from FORM and Save it to database


// --------------------------------------  For Login    -------------------------------------

//combined the LOGIN FORM Route and LOGIN route.

router.route("/login")
    .get(userController.renderLoginForm) //login form route
     //login route
    .post(saveRedirectUrl, //redirectUrl middleware call 
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }), //passport.authenticate() is middleware which is used to check if the user was present or not in data base
        userController.login
    );


//---------------------------------------------  logout  -------------------------------

router.get("/logout", userController.logout);

module.exports = router;