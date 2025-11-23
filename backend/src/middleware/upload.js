const multer = require('multer');
const path = require('path');

// Folder upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/karya');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Validasi jenis file
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error('Hanya boleh upload JPG/PNG'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // max 3MB
});

module.exports = upload;
