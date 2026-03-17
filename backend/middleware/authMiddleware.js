const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token sent
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
