const router = require('express').Router();
const fotoController = require('../controllers/FotoKaryaController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload multiple foto
router.post('/upload/:id', auth, upload.array('foto', 10), fotoController.uploadMultiple);

// Set cover foto
router.put('/set-cover/:id_foto', auth, fotoController.setCover);

// Hapus foto
router.delete('/:id_foto', auth, fotoController.deleteFoto);

module.exports = router;
