const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../services/tokenService');

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { username, password, role , specialization} = req.body;
  try {
    const user = await User.create({ username, password, role , specialization});
    req.flash('success_msg', 'Account created! Please log in.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error_msg', 'Username already exists.');
    res.redirect('/register');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    req.flash('error_msg', 'Invalid credentials.');
    return res.redirect('/login');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  user.lastLogin = new Date();
  await user.save();

  //res.redirect('/home');
  res.redirect('/user/home');
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  req.flash('success_msg', 'Logged out.');
  res.redirect('/login');
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = verifyRefreshToken(token);
    const existing = await RefreshToken.findOne({ token });
    if (!existing) return res.status(403).json({ message: 'Invalid refresh token' });

    await existing.deleteOne();
    const user = { _id: decoded.id };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await RefreshToken.create({ token: newRefreshToken, userId: user._id });

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.status(200).json({ message: 'Token refreshed' });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};