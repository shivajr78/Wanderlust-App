const Listing = require("./models/listing")  // required for isOwner middleware
const Review = require("./models/review");// required for isReviewAuthor middleware
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require('./schema.js');  // Joi Schema file required
const { reviewSchema } = require('./schema.js');  // Joi Schema file required


// Validation of schema in middleware form for listings
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // calling Joi object from schema.js 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Validation of schema in middleware form for review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // calling Joi object from schema.js 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { //inbulid method used to check if the user is logged in or not
        //if user is not logged in so we have save redirectURL
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You have to login first to create listings!");
        return res.redirect("/login");
    }
    next();
}

//middleware to saveRedirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; //as after login the passport delete the req.body so the redirectUrl will be empty.. so we now save this to locals and passports does not have any right to delete the locals
    }
    next();
}

//middleware to check authentication : is user is the owner of that listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission denied, As you are not a host of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//middleware to check authentication : is user is the owner of that review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}