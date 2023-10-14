require('dotenv').config()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer') // Import nodemailer library

// hash password
exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.log(error)
  }
}

// now make  function  for the comparison
exports.comparePwd = async (password, hashedPassword) => {
  // password: provided by user during login.
  // hashedPassword: password stored in the database.

  return bcrypt.compare(password, hashedPassword)
}

// Function to send an email with a verification link
exports.sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email, // recipient email address
    subject: 'Email Verification',
    html: `<p ClassName='text-dark'>
    Click the following link to verify your email:</p>
<a href='http://localhost:3000/api/auth/verify/${verificationToken}'>Verify your Email</a>`
  }
  transporter.sendMail(mailOptions)
}
