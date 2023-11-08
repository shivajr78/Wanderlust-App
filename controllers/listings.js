const { response } = require("express");
const Listing = require("../models/listing");

// taking the listings route callback functionality here



// Index route 
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// New route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",  //take all reviews with every listing
            populate: {
                path: "author"// and with every review take their author
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
};

// Create route
module.exports.createListing = async (req, res, next) => {  //wrap Async is error handling wrap function require from utils file.

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); // as we make name of input in form of(new.ejs) is object's key-value pair
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save(); //save to database
    console.log(req.body);
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

// Edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_160,w_290");  //decreasing the edit page image quality
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update route 
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
};

//delete route 
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings")
}