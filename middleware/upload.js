const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 10 * 1024 * 1024, // Increased field size limit
    fields: 10, // Maximum number of non-file fields
    files: 1, // Maximum number of file fields
  },
  fileFilter: (req, file, cb) => {
    // Check if file exists
    if (!file) {
      cb(new Error('No file uploaded'), false);
      return;
    }

    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
}).single('image'); // Specify that we're expecting a single file with field name 'image'

// Wrapper middleware to handle multer errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        error: true,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }
    // Everything went fine
    next();
  });
};

module.exports = uploadMiddleware;