import jwt from 'jsonwebtoken';

//admin authentication middleware
const authAdmin = async (req, res, next) => {
    console.log("Admin authentication middleware called");

    try {
        const {atoken} = req.headers;
        if(!atoken){
            
            return res.status(401).json({ message: "Admin token is required" });
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(403).json({ message: "Forbidden: Invalid admin token" });

        }

        next()

    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authAdmin;