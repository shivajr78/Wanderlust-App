const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// connect the database to cloud storage
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//define the storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV', //folder name define
        allowerdFormats: ["png", "jpg", "jpeg"], //which type of file can storage define
    },
});

module.exports = {
    cloudinary,
    storage,
};