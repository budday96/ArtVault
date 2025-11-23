const router = require('express').Router();
const KaryaSeniController = require('../controllers/KaryaSeniController');
const auth = require('../middleware/auth');

// create karya (kolektor)
router.post('/', auth, KaryaSeniController.create);

// get all karya
router.get('/', KaryaSeniController.getAll);

// get detail karya
router.get('/:id', KaryaSeniController.getById);

// update karya
router.put('/:id', auth, KaryaSeniController.update);

// delete karya
router.delete('/:id', auth, KaryaSeniController.delete);

module.exports = router;
