import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Not authorized, token missing" });
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Not authorized, token missing" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(401).json({ message: "Not authorized, user not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Not authorized, invalid token",
			error: error.message,
		});
	}
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized, user context missing" });
	}

	if (!allowedRoles.includes(req.user.role)) {
		return res.status(403).json({
			message: "Access denied. Insufficient role permissions",
		});
	}

	next();
};
