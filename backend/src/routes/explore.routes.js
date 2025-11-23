const router = require('express').Router();
const ExploreController = require('../controllers/ExploreController');

// EXPLORASI
router.get('/', ExploreController.explore);

module.exports = router;
