const User = require('../models/User');

exports.getProfile = async (req, res) => {
  res.render('profile', { user: req.user });
};

exports.getHome = async (req, res) => {
  if (req.user.role === 'patient') {
    res.render('home', { user: req.user, patientOptions: true , doctorOptions: false});
  } else if (req.user.role === 'doctor') {
    res.render('home', { user: req.user, doctorOptions: true , patientOptions: false});
  }
};