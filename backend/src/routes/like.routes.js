const router = require('express').Router();
const LikeKaryaController = require('../controllers/LikeKaryaController');
const auth = require('../middleware/auth');

// LIKE / UNLIKE
router.post('/:id_karya', auth, LikeKaryaController.toggleLike);

// GET TOTAL LIKE
router.get('/:id_karya', LikeKaryaController.getLikes);

module.exports = router;
