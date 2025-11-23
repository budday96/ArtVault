const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// ========== ADMIN KARYA ==========
router.get('/karya', auth, adminOnly, AdminController.semuaKarya);

router.put('/karya/verifikasi/:id_karya', auth, adminOnly, AdminController.verifikasiKarya);
router.put('/karya/tolak/:id_karya', auth, adminOnly, AdminController.tolakKarya);
router.delete('/karya/hapus/:id_karya', auth, adminOnly, AdminController.hapusKarya);

// ========== ADMIN USER ==========
router.put('/user/ban/:id_user', auth, adminOnly, AdminController.banUser);
router.put('/user/unban/:id_user', auth, adminOnly, AdminController.unbanUser);

// ========== ADMIN DASHBOARD ==========
router.get('/dashboard', auth, adminOnly, AdminController.dashboard);

module.exports = router;
