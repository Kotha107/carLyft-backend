const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const leadController = require('./src/controllers/lead.controller');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow Angular to access
app.use(bodyParser.json());

// Routes
app.post('/api/leads', leadController.createLead);

// Health Check
app.get('/', (req, res) => res.send('Dubai Bus API is Running'));

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});