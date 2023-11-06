const User = require("../models/user");


// taking the reviews route callback functionality here

//signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
};

//Signup Route 
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body; // taking data from FORM
        const newUser = new User({ email, username }); // creating new User
        const registeredUser = await User.register(newUser, password); // add the details in database
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
};

//Login route
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust...!");
    let redirectURL = res.locals.redirectUrl || "/listings"; //check if locals.redirectUrl is empty than pass "/listings".. otherwise pass the locals.redirectUrl value.
    res.redirect(redirectURL);
}

//logout route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {  //if any error getting while logging out 
            return next(err);
        }
        req.flash("success", "You are logged out Successfully!");
        res.redirect("/listings");
    });
};