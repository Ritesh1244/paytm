const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/userValidation');
const {allbalances,transfer} = require('../Controllers/AccountController')

router.get('/balance',ensureAuthenticated,allbalances)
router.post('/transfer',ensureAuthenticated,transfer)
module.exports = router;