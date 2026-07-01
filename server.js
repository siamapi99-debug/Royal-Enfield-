const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Authentication middleware (basic example - implement your own)
function authenticateUser(req, res, next) {
    const token = req.headers.authorization || req.cookies?.session;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Secure device configuration endpoint
app.get('/api/device/config', authenticateUser, (req, res) => {
    try {
        const config = {
            deviceName: process.env.DEVICE_NAME || 'Nexa Elite',
            deviceIMEI: process.env.DEVICE_IMEI,
            simNumber: process.env.DEVICE_SIM,
            iccid: process.env.DEVICE_ICCID,
            mdsToken: process.env.MDS_TOKEN,
            custId: process.env.CUSTOMER_ID,
            userId: process.env.USER_ID,
        };

        const requiredFields = ['deviceIMEI', 'simNumber', 'mdsToken', 'custId', 'userId'];
        const missing = requiredFields.filter(field => !config[field]);
        
        if (missing.length > 0) {
            console.error('Missing environment variables:', missing);
            return res.status(500).json({ error: 'Server configuration error' });
        }

        console.log(`Device config accessed by user at ${new Date().toISOString()}`);
        res.json(config);
    } catch (error) {
        console.error('Error retrieving device config:', error);
        res.status(500).json({ error: 'Failed to load configuration' });
    }
});

// Token refresh endpoint
app.post('/api/device/refresh-token', authenticateUser, async (req, res) => {
    try {
        // Call external API to refresh token
        const newToken = await refreshMDSToken(process.env.CUSTOMER_ID);
        process.env.MDS_TOKEN = newToken;
        res.json({ mdsToken: newToken });
    } catch (error) {
        console.error('Token refresh failed:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

async function refreshMDSToken(customerId) {
    // TODO: Replace with actual API call to your device service
    return 'new_token_' + Date.now();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ Secure dashboard server running on http://localhost:${PORT}`);
    console.log(`✓ API endpoint: http://localhost:${PORT}/api/device/config`);
    console.log('⚠ Use HTTPS in production!');
});