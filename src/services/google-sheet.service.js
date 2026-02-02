const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

exports.appendLead = async (data) => {
    const sheets = google.sheets({ version: 'v4', auth });

    // Extract variables
    const { name, email, phone, pickup, destination, date, frequency, timeFrom, timeTo } = data;
const dubaiTime = new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Dubai', // <--- This forces Dubai time regardless of where the server is
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
    const row = [
        dubaiTime,
        name,                     
        email,                    
        phone,                    
        pickup,                   
        destination,              
        date,                     
        frequency || 'One Time',  
        timeFrom,                 
        timeTo                    
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            // UPDATED RANGE: Uses your specific sheet name with single quotes
            range: "'Sheet1'!A:J", 
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });
    } catch (error) {
        console.error('Google Sheet Error:', error);
        throw error;
    }
};