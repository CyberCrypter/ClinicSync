import jwt from 'jsonwebtoken';

//user authentication middleware
const authUser = async (req, res, next) => {
    console.log("Admin authentication middleware called");

    try {
        const {token} = req.headers;
        if(!token){
            
            return res.status(401).json({ message: "Admin token is required" });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!req.body) req.body = {};
            req.body.userId = token_decode.id


        next()

    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authUser;