const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getBookPage = async (req, res) => {
  const doctors = await User.find({ role: 'doctor' });
  res.render('appointments', { user: req.user, doctors, appointments: [], csrfToken: req.csrfToken() });
};

exports.bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;

  try {
    await Appointment.create({ patient: req.user._id, doctor: doctorId, date});
    req.flash('success_msg', 'Appointment booked successfully');
    res.redirect('/user/home');
  } catch (err) {
    console.error('Error booking appointment:', err);
    req.flash('error_msg', 'Error booking appointment');
    res.redirect('/appointments/book');
  }
};

exports.getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor');
  res.render('appointments', { user: req.user, appointments ,doctors: [],csrfToken: req.csrfToken()});
};

exports.cancelAppointment = async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.appointmentId, { status: 'cancelled' });
  req.flash('success_msg', 'Appointment cancelled');
  res.redirect('/appointments/my-appointments');
};

exports.getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id }).populate('patient');
  res.render('appointments', { user: req.user, appointments ,doctors: [], csrfToken: req.csrfToken()});
};
