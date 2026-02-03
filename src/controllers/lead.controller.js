const googleSheetService = require('../services/google-sheet.service');
const emailService = require('../services/email.service');

exports.createLead = async (req, res) => {
    try {
        const data = req.body;
        console.log('📝 Received Lead:', data.email);

        // 1. Save to Sheet
        await googleSheetService.appendLead(data);

        // 2. Send Email (Added 'await' so we can see if it fails in the logs)
        try {
            await emailService.sendNotification(data);
            console.log('✅ Email process completed.');
        } catch (emailError) {
            console.error('⚠️ Email failed but Lead saved:', emailError.message);
        }

        res.status(200).json({ message: 'Lead received successfully!' });

    } catch (error) {
        console.error('❌ Controller Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};