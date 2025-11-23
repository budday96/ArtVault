const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

// PUBLIC
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// PRIVATE
router.get('/profile', auth, AuthController.profile);

module.exports = router;
