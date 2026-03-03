const UserService = require('../services/user.service');

exports.register = async (req, res,next) => {
    try {
        const userData = req.body;
        const newUser = await UserService.registerUser(userData);
        res.status(201).json({
            message: 'User registered successfully',
            data: newUser
        })
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res,next) => {
    try {
        const loginData = req.body;
        const user = await UserService.loginUser(loginData);
        res.status(200).json({
            message: 'Login successful',
            data: user
        });
    } catch (error) {
        next(error);
    }
}