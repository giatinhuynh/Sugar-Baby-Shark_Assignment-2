const multer = require('multer');
const path = require('path');

// Set up Multer to handle file uploads
const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../public/images/profileImages'); // Set the destination folder for uploaded files
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + "-"+req.session.id); // Set the file name
    }
});

module.exports = imageStorage; // Export the storage configuration
