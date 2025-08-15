import jwt from 'jsonwebtoken';

//doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const {dtoken} = req.headers;
        if(!dtoken){

            return res.status(401).json({ message: "Doctor token is required" });
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

        if (!req.body) req.body = {};
            req.body.docId = token_decode.id


        next()

    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authDoctor;