exports.isFacultyOrAdmin = (req, res, next) => {
  if (req.user.role === "faculty" || req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Faculty or Admin access required" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};
