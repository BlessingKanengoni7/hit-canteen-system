const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
    return (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token" });
        }

        // Remove "Bearer " from the header
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, "HIT_SECRET");

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            req.user = decoded;
            next();

        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};
