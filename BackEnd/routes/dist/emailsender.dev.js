"use strict";

var express = require('express');

var nodemailer = require('nodemailer');

var router = express.Router();
var hodEmailMapping = {
  "Artificial Intelligence and Data Science": "rohitvijayan1111@gmail.com",
  "Civil Engineering": "rohitvijayan1111@gmail.com",
  "Computer Science and Business Systems": "rohitvijayan1111@gmail.com",
  "Computer Science and Design": "rohitvijayan1111@gmail.com",
  "Computer Science and Engineering": "rohitvijayan1111@gmail.com",
  "Electrical and Electronics Engineering": "rohitvijayan1111@gmail.com",
  "Electronics and Communication Engineering": "rohitvijayan1111@gmail.com",
  "Electronics and Instrumentation Engineering": "rohitvijayan1111@gmail.com",
  "Information Technology": "rohitvijayan1111@gmail.com",
  "Mechanical Engineering": "rohitvijayan1111@gmail.com"
};
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
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
            subject: "".concat(subject),
            text: "".concat(desc)
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          res.status(200).send('Form created and email sent');
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](2);
          console.error('Error sending email:', _context.t0);
          res.status(500).send('Error creating form or sending email: ' + _context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 8]]);
});
router.post('/approveEventByHOD', function _callee2(req, res) {
  var _req$body2, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, formSubject = _req$body2.formSubject, department = _req$body2.department, emails = _req$body2.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          console.log(department);
          emailList.push(hodEmailMapping[department]);
          console.log(emailList);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: ['broh22012.it@rmkec.ac.in'],
            subject: "Notification: New Hall Booking Form Submitted by ".concat(department, " HOD"),
            text: "".concat(formSubject),
            cc: emailList
          };
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          res.status(200).send('Notification email sent to Academic Coordinator');
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](6);
          console.error('Error sending email:', _context2.t0);
          res.status(500).send('Error sending notification email: ' + _context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
router.post('/approveEventByAcademicCoordinator', function _callee3(req, res) {
  var _req$body3, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, formSubject = _req$body3.formSubject, department = _req$body3.department, emails = _req$body3.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: 'like22050.it@rmkec.ac.in',
            cc: emailList,
            subject: "Notification: Hall Booking Form Approved by Academic Coordinator",
            text: "The hall booking form \"".concat(formSubject, "\" has been approved by Academic Coordinator.")
          };
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to Principal and HOD');
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](4);
          console.error('Error sending email:', _context3.t0);
          res.status(500).send('Error sending notification email: ' + _context3.t0);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/approveEventByPrincipal', function _callee4(req, res) {
  var _req$body4, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, formSubject = _req$body4.formSubject, department = _req$body4.department, emails = _req$body4.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: emailList,
            cc: ['broh22012.it@rmkec.ac.in', 'like22050.it@rmkec.ac.in'],
            subject: "Notification: Hall Booking Form Approved by Principal",
            text: "The hall booking form \"".concat(formSubject, "\" has been approved by Principal.")
          };
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to HOD and Academic Coordinator');
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](4);
          console.error('Error sending email:', _context4.t0);
          res.status(500).send('Error sending notification email: ' + _context4.t0);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
module.exports = router;