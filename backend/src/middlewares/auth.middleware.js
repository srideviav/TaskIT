const jwt = require('jsonwebtoken');

exports.protect = (req,res,next) => {
    const header =req.headers.authorization;
    console.log('Authorization Header:', header); // Debugging line
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message:'Unauthorized'});
    }

    const token = header.split(' ')[1];
    console.log('Extracted Token:', token); // Debugging line
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Debugging line
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(401).json({message:'Invalid Token'});
    }
}