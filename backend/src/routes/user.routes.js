const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/user.validator');

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);    


module.exports = router;