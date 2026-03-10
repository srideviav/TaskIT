const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.registerUser = async (data) => {
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
    await newUser.save();
    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
    };
}

exports.existingUser = async (data) => {
    const { email } = data;
    const user = await User.findOne({ email });
    return user;
};

exports.checkEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return user;  
};
 

exports.getAllUsers = async () => {
    const users = await User.find();
    return users;
}