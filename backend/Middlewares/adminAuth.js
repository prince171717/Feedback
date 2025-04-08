import { protectRoute } from "./authValidation.js";

export const adminProtectRoute = async (req, res, next) => {
  try {
    await protectRoute(req, res, async () => {
      if (req.user && req.user.role === "admin") {
        next(); // ✅ Allow access
      } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
    });
  } catch (error) {
    console.error("Error in adminProtectRoute:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

