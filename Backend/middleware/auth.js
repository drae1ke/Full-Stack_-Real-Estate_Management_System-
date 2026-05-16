const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_local_dev";

async function auth(req, res, next) {
  const token = req.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.email) {
      return res.sendStatus(401);
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = {
      ...decoded,
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      image: user.image,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.sendStatus(403);
  }

  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.sendStatus(403);
    }

    next();
  };
}

exports.auth = auth;
exports.requireAdmin = requireAdmin;
exports.requireRole = requireRole;
exports.requireUser = requireRole("user");
