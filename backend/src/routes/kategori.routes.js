const router = require('express').Router();
const KategoriKaryaController = require('../controllers/KategoriKaryaController');
const auth = require('../middleware/auth');

// middleware kecil untuk admin-only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Hanya admin yang boleh mengakses" });
  }
  next();
};

// ==== PUBLIC ====
// GET semua kategori aktif
router.get('/', KategoriKaryaController.getAll);
// GET detail kategori
router.get('/:id', KategoriKaryaController.getById);

// ==== ADMIN ====
// Tambah kategori
router.post('/', auth, adminOnly, KategoriKaryaController.create);
// Update kategori
router.put('/:id', auth, adminOnly, KategoriKaryaController.update);
// Soft delete
router.delete('/:id', auth, adminOnly, KategoriKaryaController.softDelete);

module.exports = router;
