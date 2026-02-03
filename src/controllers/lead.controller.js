const googleSheetService = require('../services/google-sheet.service');
const emailService = require('../services/email.service');

exports.createLead = async (req, res) => {
    try {
        const data = req.body;
        console.log('📝 Received Lead:', data.email);

        // 1. Save to Google Sheet (We AWAIT this because it's fast)
        await googleSheetService.appendLead(data);

        // 2. Send Email (FIRE AND FORGET)
        // We do NOT use 'await' here. We let it run in the background.
        emailService.sendNotification(data)
            .then(() => console.log('✅ Email sent successfully (Background)'))
            .catch(err => console.error('⚠️ Background Email Failed:', err.message));

        // 3. Send Success Response IMMEDIATELY
        // This stops the spinner on the frontend instantly.
        res.status(200).json({ message: 'Lead received successfully!' });

    } catch (error) {
        console.error('❌ Controller Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};