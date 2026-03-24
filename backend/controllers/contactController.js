const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: `Chatorzzz Contact <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // Send TO the admin
    replyTo: options.replyTo,
    subject: `New Inquiry: ${options.subject}`,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    
    // Attempt to send email alert to admin
    try {
      await sendEmail({
        replyTo: inquiry.email,
        subject: inquiry.subject,
        message: `New message from ${inquiry.name} (${inquiry.email}):\n\n${inquiry.message}`
      });
    } catch (emailErr) {
      console.error('Failed to send contact inquiry email:', emailErr);
    }

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
