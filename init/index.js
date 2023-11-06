// initialization of the data

// data taken from data.js
// model taken from listing.js
// using them making a initDB function, initialize the data 

const mongoose = require("mongoose");
const initData = require("./data.js");  //requiring data from data.js
const Listing = require("../models/listing.js"); // requiring model from listing.js
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DataBase");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URL);
}

//function to initialize the data 
const initDB = async ()=>{
    await Listing.deleteMany({}); // first delete the data if already present in database
    initData.data = initData.data.map((obj)=>({...obj, owner : "653de92dbf0a17b21ea8f726"})); //Access the object first and add old object completely again to it... and then add owner field which we want to added newly
    await Listing.insertMany(initData.data); //now inserting the data where initData is a Object and data is a key from data.js exports
    console.log("data was initialized");
}

initDB();