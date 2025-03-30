const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklisttoken.model");

module.exports.userAuth = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization;

    // Check if token is missing or empty
    if (!token || token.trim() === "") {
      return res
        .status(401)
        .json({ error: "Unauthorized: Token not provided" });
    }

    // Check if token is blacklisted
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Token is blacklisted" });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Check if the user exists in the database
    const user = await userModel.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
