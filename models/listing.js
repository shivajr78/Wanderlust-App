// Create templates : Create Schema and model
//and export them

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
//Creating Schema
const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    image: {
        url: String,
        filename: String,

    },
    price: Number,
    location: String,
    country: String,
    reviews: [   // array is because, we store many no. of reviews for one post 
        {
            type: Schema.Types.ObjectId, //store all the object id of reviews here
            ref: "Review", //Review model is the reference
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
    }
})

// deletion middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); // it delete all the reviews if the listing is delete 
    }
})

//Creating Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;