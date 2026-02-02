const sheetService = require('../services/google-sheet.service');
const emailService = require('../services/email.service');

exports.createLead = async (req, res) => {
    try {
       const { name, email, phone, pickup, destination, date, frequency, timeFrom, timeTo } = req.body;
        // 1. Basic Validation
        if (!name || !phone || !pickup || !destination) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // 2. Save to Google Sheet
        await sheetService.appendLead(req.body);

        // 3. Send Email (Async, don't wait strictly for it to return response)
        emailService.sendNotification(req.body);

        res.status(200).json({ message: 'Lead submitted successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};