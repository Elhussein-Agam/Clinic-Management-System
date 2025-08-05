const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

router.get('/book', verifyToken, appointmentController.getBookPage);
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.get('/my-appointments', verifyToken, appointmentController.getMyAppointments);
router.post('/cancel/:appointmentId', verifyToken, appointmentController.cancelAppointment);
router.get('/doctor-appointments', verifyToken, appointmentController.getDoctorAppointments);

module.exports = router;