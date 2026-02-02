const googleSheetService = require('../services/google-sheet.service');
const emailService = require('../services/email.service'); // <--- IMPORT THIS

exports.createLead = async (req, res) => {
    try {
        const data = req.body;
        console.log('📝 Received Lead:', data.email);

        // 1. Save to Google Sheet
        await googleSheetService.appendLead(data);

        // 2. Send Emails (The missing step!)
        // We don't use 'await' here so the user gets a fast response 
        // while the email sends in the background.
        emailService.sendNotification(data).catch(err => console.error('Email Fail:', err));

        // 3. Send Success Response to Frontend
        res.status(200).json({ message: 'Lead received successfully!' });

    } catch (error) {
        console.error('❌ Controller Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};