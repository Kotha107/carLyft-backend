const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendNotification(data) {
    // 1. Extract variables from the form data
    const { name, email, phone, pickup, destination, date, frequency, timeFrom, timeTo } = data;

    // --- EMAIL A: FOR YOU (ADMIN) ---
    // Simple text with all the raw details you need.
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sends to yourself
        subject: `🔔 New Lead: ${name} (${frequency})`,
        text: `
            New Booking Request
            -------------------
            Name: ${name}
            Phone: ${phone}
            Email: ${email}
            
            Route: ${pickup} TO ${destination}
            Start Date: ${date}
            Frequency: ${frequency}
            Time: ${timeFrom} - ${timeTo}
        `
    };

    // --- EMAIL B: FOR THE CUSTOMER ---
    // Professional HTML receipt so they feel safe.
    const userMailOptions = {
        from: `"Dubai Bus Services" <${process.env.EMAIL_USER}>`, // Shows a professional name
        to: email, // Sends to the email they typed in the form
        subject: `✅ Booking Received: Pickup Request for ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">Request Received</h2>
                </div>
                
                <div style="padding: 20px;">
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>We have received your transport request. Our team is reviewing your route and will contact you shortly via WhatsApp or Phone.</p>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333; font-size: 16px;">Your Trip Details:</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; color: #555;">
                            <li style="padding: 5px 0;"><strong>📍 Route:</strong> ${pickup} ➝ ${destination}</li>
                            <li style="padding: 5px 0;"><strong>📅 Start Date:</strong> ${date}</li>
                            <li style="padding: 5px 0;"><strong>⏰ Time:</strong> ${timeFrom} - ${timeTo}</li>
                            <li style="padding: 5px 0;"><strong>📞 Contact:</strong> ${phone}</li>
                        </ul>
                    </div>

                    <p style="font-size: 14px; color: #666;">If you need to make urgent changes, please reply to this email.</p>
                </div>
                
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    Dubai Bus Pickup Services
                </div>
            </div>
        `
    };

    try {
        // Send BOTH emails at the same time
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);
        console.log('✅ Emails sent successfully to Admin and User');
    } catch (error) {
        console.error('❌ Email Error:', error);
        // We log the error but don't stop the server, so the user still sees "Success"
    }
}

module.exports = { sendNotification };