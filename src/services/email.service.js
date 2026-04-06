require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN, 
  },
});

// Verify once
transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready');
  }
});

// Send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html: html || '',
    });

    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Register email
async function sendRegisterEmail(userEmail, name) {
  const subject = 'Welcome to Backend Ledger!';
  const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.\nWe're excited to have you on board.\n\nBest regards,\nBackend Ledger Team`;

  const html = `
    <p>Hello ${name},</p>
    <p>Thank you for registering at Backend Ledger.</p>
    <p>We're excited to have you on board.</p>
    <p>Best regards,<br>Backend Ledger Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

// Transaction Email
async function sendTransactiontoEmail(userEmail, name, amount, toAccountId) {
  const subject = 'Transaction Successful 💸';

  const text = `
Hello ${name},

Your transaction was successful.

Amount Sent: ₹${amount}
To Account ID: ${toAccountId}

If you did not perform this transaction, please contact support immediately.

Best regards,
Backend Ledger Team
`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2 style="color:#4CAF50;">Transaction Successful 💸</h2>
      
      <p>Hello <strong>${name}</strong>,</p>
      
      <p>Your transaction has been completed successfully.</p>

      <table style="border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Amount:</td>
          <td style="padding: 8px;">₹${amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">To Account:</td>
          <td style="padding: 8px;">${toAccountId}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
        If you did not perform this transaction, please contact support immediately.
      </p>

      <p>Best regards,<br><strong>Backend Ledger Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionFailureEmail(userEmail, name, amount, toAccountId) {
  const subject = "Transaction Failed ❌";

  const text = `
  Hello ${name},

We regret to inform you that your transaction has failed.

Amount: ₹${amount}
To Account ID: ${toAccountId}

Please try again later. If the issue persists, contact support.

Best regards,
Backend Ledger Team
`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2 style="color:#e53935;">Transaction Failed ❌</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>We regret to inform you that your transaction could not be completed.</p>

      <table style="border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Amount:</td>
          <td style="padding: 8px;">₹${amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">To Account:</td>
          <td style="padding: 8px;">${toAccountId}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
        Please try again later. If the issue persists, contact support.
      </p>

      <p>Best regards,<br><strong>Backend Ledger Team</strong></p>
    </div>
  `;

  // Correct function call
  await sendEmail(userEmail, subject, text, html);
}
module.exports = {
  sendRegisterEmail,
  sendTransactiontoEmail,
  sendTransactionFailureEmail
};