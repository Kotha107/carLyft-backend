const googleSheetService = require('../services/google-sheet.service');

exports.createLead = async (req, res) => {
    try {
        const data = req.body;
        console.log('📝 Received Lead:', data.email);

        // 1. Save to Google Sheet
        await googleSheetService.appendLead(data);

        // 2. Respond immediately (No waiting for email)
        res.status(200).json({ message: 'Lead received successfully!' });

    } catch (error) {
        console.error('❌ Controller Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};