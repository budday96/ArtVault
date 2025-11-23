const router = require('express').Router();
const KomentarKaryaController = require('../controllers/KomentarKaryaController');
const auth = require('../middleware/auth');

// Tambah komentar
router.post('/:id_karya', auth, KomentarKaryaController.create);

// Ambil semua komentar karya
router.get('/:id_karya', KomentarKaryaController.getByKarya);

// Edit komentar
router.put('/edit/:id_komentar', auth, KomentarKaryaController.update);

// Delete komentar
router.delete('/delete/:id_komentar', auth, KomentarKaryaController.delete);

module.exports = router;
