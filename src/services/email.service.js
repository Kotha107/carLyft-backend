const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Debug: Check if variables exist (Prints to Render Logs)
console.log('📧 Email Service Loaded');
console.log('📧 User:', process.env.EMAIL_USER ? 'Set ✅' : 'Missing ❌');
console.log('📧 Pass:', process.env.EMAIL_PASS ? 'Set ✅' : 'Missing ❌');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendNotification = async (data) => {
    console.log('🔄 Attempting to send email to:', data.email);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email, // Sends to the user
        cc: process.env.EMAIL_USER, // Sends a copy to YOU (Owner)
        subject: 'Booking Confirmation - Car Lift Service',
        text: `Hello ${data.name},\n\nWe received your booking request for ${data.date} at ${data.timeFrom}.\n\nPickup: ${data.pickup}\nDropoff: ${data.destination}\n\nWe will contact you shortly to confirm.\n\nThank you!`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email Sent Successfully! Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email Error Detailed:', error); // This will show the REAL error in logs
        throw error;
    }
};