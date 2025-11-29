const router = require('express').Router();
const KaryaSeniController = require('../controllers/KaryaSeniController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// create karya (kolektor)
router.post('/', auth, KaryaSeniController.create);

// get all karya
router.get('/', KaryaSeniController.getAll);
 
router.get('/me', auth, KaryaSeniController.getMyKarya);

// get detail karya
router.get('/:id', KaryaSeniController.getById);

// update karya
router.put('/:id', auth, KaryaSeniController.update);

// delete karya
router.delete('/:id', auth, KaryaSeniController.delete);

// -------------- APPROVE BY ADMIN --------------
router.put('/approve/:id', auth, adminOnly, KaryaSeniController.approveKarya);

module.exports = router;
