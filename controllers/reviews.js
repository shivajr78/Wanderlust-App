const Listing = require("../models/listing");
const Review = require("../models/review");


// taking the reviews route callback functionality here

//Create Review Route
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id); //finding listing using id that which comes with route
    let newReview = new Review(req.body.review)// taking review from FORM and store it into newReview
    newReview.author = req.user._id;
    // push newReview which consist a review in  "reviews array"
    listing.reviews.push(newReview);
    await newReview.save(); // save the new review in database
    await listing.save(); // save the new listing again in database because review is add to it
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`)
};

// Delete Review Route
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //here pull is express method,, in which reviewId from reviews array is pulled 
    await Review.findByIdAndDelete(reviewId); //find and delete the review in reviews array
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}