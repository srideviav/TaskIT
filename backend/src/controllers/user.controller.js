const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {

        const userData = req.body;
        const isUserExist = await UserService.existingUser(userData);
        if (isUserExist) {
            res.status(200).json({
                message: 'User already exists'
            });
            return;
        } else {
            const newUser = await UserService.registerUser(userData);
            res.status(201).json({
                message: 'User registered successfully',
                data: newUser
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.checkEmailAndPassword(email, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
         
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                _id:user._id,
                name:user.name,
                email:user.email,
                password:user.password,
                token:token
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            message: 'Users fetched successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
}