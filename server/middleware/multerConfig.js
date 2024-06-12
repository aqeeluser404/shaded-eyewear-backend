const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads directory if it doesn't exist
const dir = path.join(__dirname, '../uploads');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        // Replace colons in the timestamp with dashes to avoid issues on Windows
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;