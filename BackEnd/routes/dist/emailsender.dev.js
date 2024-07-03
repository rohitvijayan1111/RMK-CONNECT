"use strict";

var express = require('express');

var nodemailer = require('nodemailer');

var router = express.Router();
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel'
  }
});
router.post('/send', function _callee(req, res) {
  var _req$body, subject, to, desc, mailOptions;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, subject = _req$body.subject, to = _req$body.to, desc = _req$body.desc;
          mailOptions = {
            from: {
              name: 'RMKEC UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: to,
            subject: "New Form Created: ".concat(subject),
            text: "A new form has been created. Deadline: ".concat(desc)
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          res.status(200).send('Form created and email sent');
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](2);
          res.status(500).send('Error creating form or sending email: ' + _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 8]]);
});
module.exports = router;