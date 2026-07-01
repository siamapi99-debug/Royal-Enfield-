require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('.'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get device config
app.get('/api/config', (req, res) => {
  res.json({
    deviceName: process.env.DEVICE_NAME || 'Nexa Elite',
    deviceIMEI: process.env.DEVICE_IMEI || '869727077401113',
    simNumber: process.env.DEVICE_SIM || '01349619785',
    mdsToken: process.env.MDS_TOKEN || '8b287d3e19a9408d9e2ce7a225190c2f',
    custId: process.env.CUSTOMER_ID || 'c27c9f22-0e02-40c8-8e6c-9703971d4df9',
    userId: process.env.USER_ID || 'c27c9f220e0240c88e6c9703971d4df9'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Dashboard running on port ${PORT}`);
});
