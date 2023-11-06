if (process.env.NODE_ENV != "production") {
    require('dotenv').config(); //requiring dotenv to process/load the .env file credentials and process.env
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js"); // it requires the CRUD methods which is written in listings.js of routes folder
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
//Requiring for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const userRouter = require("./routes/user.js")

// const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


//Store : Connect-Mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:  process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error",()=>{
    console.log("Error, in Mongo Session Store",error)
})

//define session options
const sessionOption = {
    store, //send mongoStore to session options
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // expries after one week from today and now = 7days * 24hours * 60mintues *60seconds * 1000 miliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // for login and logout buttons
    next();
})

// //Middleware to create demo user in database 
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email : "abc@gmail.com",
//         username : "abcjr78",
//     });
//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// });



//connecting ejs file template
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); //for css file

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);


//connection the db from node.js
main().then(() => {
    console.log("Connected to DataBase");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}

app.get("/camping", (req, res) => {
    res.send("Hello,Ammu!")
})


//calling the listings file which consist of CRUD method
app.use("/listings", listingRouter);

//calling the review CRUD method
app.use("/listings/:id/reviews", reviewRouter);
//calling the signup CRUD method
app.use("/", userRouter);


//For Routes which are not in Our App
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

//Common Error Handler Middlerware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
})

app.listen(8085, () => {
    console.log("Server is listening to port 8085...");
});