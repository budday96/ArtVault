const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) 
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const bearer = token.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    req.user = decoded; // id_user, role
    next();
  });
};
