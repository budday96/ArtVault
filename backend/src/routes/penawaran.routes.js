const router = require('express').Router();
const PenawaranController = require('../controllers/PenawaranKaryaController');
const auth = require('../middleware/auth');

// tambah penawaran (bid)
router.post('/:id_karya', auth, PenawaranController.tambahPenawaran);

// list penawaran pada sebuah karya
router.get('/karya/:id_karya', PenawaranController.getByKarya);

// histori penawaran user
router.get('/user/me', auth, PenawaranController.getByUser);

module.exports = router;
