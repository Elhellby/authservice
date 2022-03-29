const router = require('express-promise-router')();

const {
    login,
    logout,
    ping,
    register,
    activate,
    encrypt,
    decrypt
} = require('../controllers/securityController');

router.post('/login', login);
router.patch('/logout/:id', logout);

router.get('/ping', ping);

router.post('/register', register);

router.patch('/activate/:id', activate);

// router.post('/encrypt', encrypt);
// router.post('/decrypt', decrypt);

module.exports = router;