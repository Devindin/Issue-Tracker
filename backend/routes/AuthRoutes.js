const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require('nodemailer');

////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
const authMiddleware = require('../middleware/authmiddleware');
///////////////////////////////////////////////////////
require("dotenv").config();
///////////////////////////////////////////////////////

/////////////////// Create a Nodemailer transporter///////////////////////////
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '991017anuradha@gmail.com', 
    pass: 'ctff rqfn mvqr btug'    
  }
});

//////////////////add new receptionist/////////////////
router.post("/addNewReceptionist", async (req, res) => {
  console.log("sent by the client side -", req.body);

  const { firstName, lastName, email, password, userID, contact } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const receptionist = new Receptionist({
      firstName,
      lastName,
      email,
      contact,
      userID,
      password: hashPassword,
    });

    await receptionist.save();
    res.send({ message: "user registered successfuly" });
  } catch (error) {
    console.log("Database error", error);
    return res.status(422).send({ error: error.message });
  }
});


//////////////// Receptionist Login/////////////////////
router.post("/receptionistLogin", async (req, res) => {
  const { userID, password } = req.body;

  try {
    const receptionist = await Receptionist.findOne({ userID });
    if (!receptionist) {
      return res.status(401).send({ error: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, receptionist.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid Password" });
    }

    const token = jwt.sign({ userId: receptionist._id }, process.env.JWT_SECRET,{
      expiresIn :"10m"
    });
    const email = receptionist.email;

    //////// Send email upon successful login//////
    const mailOptions = {
      from: '991017anuradha@gmail.com',
      to: email,
      subject: 'Login Notification',
      text: "Hello, you have successfully logged in to the Hope Springs Hospital Appointment management System ."
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.json({ token, username: receptionist.firstName });
  } catch (error) {
    console.error("Datbase Error", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});


///////// make a appointment//////
router.post("/makeAppointment", async (req, res) => {
  console.log("sent by the client side -", req.body);

  const { date, time, patientNo,patientName,patientNIC,patientContact,patientAddress,doctor} = req.body;

  try {

    const appointment = new Appointment({
      date, 
      time, 
      patientNo,
      patientName,
      patientNIC,
      patientContact,
      patientAddress,
      doctor,
    });

    await appointment.save();
    res.send({ message: "appointment make successfuly" });
  } catch (error) {
    console.log("Database error", error);
    return res.status(422).send({ error: error.message });
  }
});

/////////////////////cancel Appointment//////////////////////////////////////////

router.delete('/cancelAppointment/:id', authMiddleware, async (req, res) => {
  try {
      const appointmentId = req.params.id;
      console.log("Canceling appointment with ID:", appointmentId);

      const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

      if (!deletedAppointment) {
          return res.status(404).json({ error: "Appointment not found" });
      }

      res.json({ message: 'Appointment canceled successfully' });

  } catch (error) {
      console.error("Error canceling appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


//////////////////////////// add new Doctor///////////////////////////

router.post("/addNewDoctor", async (req, res) => {
  console.log("sent by the client side -", req.body);

  const { firstName, lastName,dateOfBirth,gender, specialty,experience,licenseNumber,contact,email, address, userID, password  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      specialty,
      experience,
      licenseNumber,
      email,
      address,
      contact,
      userID,
      password: hashPassword,
    });

    await doctor.save();
    res.send({ message: "doctor registered successfuly" });
  } catch (error) {
    console.log("Database error", error);
    return res.status(422).send({ error: error.message });
  }
});




//////////////////////////////// add new Patient//////////////////////////////

router.post("/addNewPatient", async (req, res) => {
  console.log("sent by the client side -", req.body);

  const { firstName, lastName,age,gender,contact, address,patientID, patientNIC, diagnose,treatment  } = req.body;

  try {
  

    const patient = new Patient({
      firstName, 
      lastName,
      age,
      gender,
      contact, 
      address,
      patientID, 
      patientNIC, 
      diagnose,
      treatment 
    });

    await patient.save();
    res.send({ message: "patient registered successfuly" });
  } catch (error) {
    console.log("Database error", error);
    return res.status(422).send({ error: error.message });
  }
});

//////////////////////// Doctor Login /////////////////////////

router.post("/doctorLogin", async (req, res) => {
  const { userID, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ userID });
    if (!doctor) {
      return res.status(401).send({ error: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid Password" });
    }

    const token = jwt.sign({ userId: doctor._id }, process.env.JWT_SECRET,{
      expiresIn :"10m"
    });
    const email = doctor.email;
    ////////////// Send email upon successful login//////////
    const mailOptions = {
      from: '991017anuradha@gmail.com',
      to: email,
      subject: 'Login Notification',
      text: "Hello, you have successfully logged in to the Future Tech official page."
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.json({ token, username: doctor.firstName });
  } catch (error) {
    console.error("Datbase Error", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

//////////////////////////fetch all doctors////////////////////////////

router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

///////////////fetch appointments by doctor and date/////////////////////////

router.post('/appointments', async (req, res) => {
  const { doctor, date } = req.body;
  try {
    const appointments = await Appointment.find({ doctor, date });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


///////////////// Fetch appointments for a specific doctor based on date////////////////////

router.post('/doctor/appointments', async (req, res) => {
  const { userID, date } = req.body;
  try {
      const appointments = await Appointment.find({ userID, date });
      res.status(200).json(appointments);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch appointments', error });
  }
});


///////////////////////////Get patient details by NIC////////////////////////////////

router.get('/patient/:nic', async (req, res) => {
  try {
      const patient = await Patient.findOne({ patientNIC: req.params.nic });
      if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json(patient);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch patient details', error });
  }
});

//////////////////////////////// Update patient details//////////////////////////////

router.put('/patient/:id', async (req, res) => {
  try {
      const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json(updatedPatient);
  } catch (error) {
      res.status(500).json({ message: 'Failed to update patient details', error });
  }
});

//////////////////////////////////////////// Delete patient////////////////////////////////////

router.delete('/patient/:id', async (req, res) => {
  try {
      const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
      if (!deletedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete patient', error });
  }
});

///////// Fetch all doctor names and IDs ////////////

router.get('/doctorNames', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'firstName lastName _id');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

///////// Fetch doctor details by ID ////////////////

router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor details' });
  }
});

/////////////////// Update doctor details by ID /////////////

router.put('/doctor/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor details' });
  }
});

///////////////////////////////// Delete doctor by ID ////////////////////

router.delete('/doctor/:id', async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});


///////////////////////// Fetch appointments for a doctor on a specific date//////////////////////

router.post('/doctor/appointments', async (req, res) => {
  const { userID, date } = req.body;
  try {
      
      const doctor = await Doctor.findOne({ userID });
      if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
      }

      const appointments = await Appointment.find({ doctor: doctor._id, date });
      res.json(appointments);
  } catch (error) {
      console.error('Failed to fetch appointments', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


// /////////////////////////Cancel an appointment///////////////////////

router.delete('/api/cancelAppointment/:id', async (req, res) => {
  try {
      const appointmentId = req.params.id;
      await Appointment.findByIdAndDelete(appointmentId);
      res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
      console.error('Failed to cancel appointment', error);
      res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

router.get('/profile/:userType', authMiddleware, async (req, res) => {
  const { userType } = req.params;
  const { userId } = req;

  try {
    let user;
    if (userType === 'receptionist') {
      user = await Receptionist.findById(userId).select('-password');
    } else if (userType === 'doctor') {
      user = await Doctor.findById(userId).select('-password');
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;