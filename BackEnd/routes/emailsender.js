const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  service:'gmail',
  port:587,
  secure:false,
  auth: {
    user:'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel',
  },
});

router.post('/send', async (req, res) => {
 const { subject,to, desc } = req.body;
   const mailOptions = {
    from: {name:'RMKEC UPDATES',address:'rohitvijayandrive@gmail.com'},
    to: to,     
    subject: `New Form Created: ${subject}`,
    text: `A new form has been created. Deadline: ${desc}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Form created and email sent');
  } catch (error) {
    res.status(500).send('Error creating form or sending email: ' + error);
  }
});

module.exports = router;
