const express = require('express');
const router = express.Router();
const {signupvalidation,signInvalidation} = require('../Middlewares/Authvalidation');
const { signup,SignIn,upDate,allUser } = require('../Controllers/AuthController');
const ensureAuthenticated = require('../Middlewares/userValidation');


router.post('/user/signup', signupvalidation, signup);
router.post('/user/sigIn', signInvalidation, SignIn);
router.put('/user/update', ensureAuthenticated, upDate);
router.get('/user/bulk',allUser)

module.exports = router;
