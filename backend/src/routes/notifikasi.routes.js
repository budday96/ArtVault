const router = require('express').Router();
const NotifikasiController = require('../controllers/NotifikasiController');
const auth = require('../middleware/auth');

// Ambil semua notifikasi saya
router.get('/', auth, NotifikasiController.getMyNotifications);

// Jumlah belum dibaca
router.get('/unread-count', auth, NotifikasiController.getUnreadCount);

// Tandai satu sebagai sudah dibaca
router.put('/:id_notifikasi/read', auth, NotifikasiController.markAsRead);

// Tandai semua sebagai sudah dibaca
router.put('/read-all', auth, NotifikasiController.markAllAsRead);

module.exports = router;
