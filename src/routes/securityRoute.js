const router = require('express-promise-router')();

const {
    login,
    logout,
    ping,
    register,
    encrypt,
    decrypt
} = require('../controllers/securityController');

router.post('/login', login);
router.post('/logout', logout);

router.get('/ping', ping);

router.post('/register', register);

router.post('/encrypt', encrypt);
router.post('/decrypt', decrypt);

module.exports = router;