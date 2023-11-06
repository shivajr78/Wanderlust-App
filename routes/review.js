const express = require('express');
const router = express.Router({mergeParams:true}); // taking the id from parent to child... that is "app.use(/listing/:id/reviews", reviews) in app.js
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");//accessing the middleware from middleware file

const reviewController = require("../controllers/reviews.js");

//Create Reviews Route : for create new review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route : for delete the new review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;