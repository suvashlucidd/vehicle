// nodemailerConfig.js

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Your Gmail email address
    pass: 'your_password' // Your Gmail password or an application-specific password
  }
});

module.exports = transporter;
