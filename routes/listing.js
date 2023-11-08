const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const multer = require('multer'); //parse the photo upload data
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage }) //save file into storage of Cloud
const listingController = require("../controllers/listings.js");

// combined INDEX route and CREATE route as they are same at "/".
router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); //create route

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// combined SHOW route,UPDATE route and DELETE route as they are same at "/:id".
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // show router
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) // delete route

//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

