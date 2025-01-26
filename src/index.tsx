import * as functions from 'firebase-functions';
import nodemailer from 'nodemailer';

// Create Nodemailer transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kanmanipriyas.22cse@kongu.edu', // Your email
    pass: 'kanmanipriya@123'   // Your email password or App Password (if 2FA enabled)
  }
});

// Firebase function to send email
exports.sendEmail = functions.https.onCall((data, context) => {
  const { to, subject, text } = data;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  // Send the email
  return transporter.sendMail(mailOptions)
    .then((info) => {
      console.log('Email sent: ' + info.response);
      return { message: 'Email sent successfully' };
    })
    .catch((error) => {
      console.error(error);
      throw new functions.https.HttpsError('internal', 'Error sending email', error);
    });
});
