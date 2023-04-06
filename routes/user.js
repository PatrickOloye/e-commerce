const { createUser, getAll, getUser, login } = require('../controller/user');

const router = require('express').Router();

router.post('/signUp', createUser);
router.get('/getAll', getAll);
router.get('/getUser', getUser);
router.post('/login', login);

module.exports = router;
