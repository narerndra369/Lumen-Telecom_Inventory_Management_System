const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function managerMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "manager" && decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied, manager or admin role required" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = managerMiddleware;
