const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async function (req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};