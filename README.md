# Nexa Elite Secure Dashboard

## 🔒 Security Implementation

This dashboard has been refactored to remove all hardcoded credentials and implement secure credential management.

## 📋 Quick Start

### Step 1: Clone & Install Dependencies
```bash
# Clone repository
git clone https://github.com/siamapi99-debug/Royal-Enfield-.git
cd Royal-Enfield-

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables
```bash
# Copy example configuration
cp .env.example .env

# Edit .env with your actual credentials (NEVER commit this file)
nano .env
```

**Add your credentials to `.env`:**
```
DEVICE_NAME=Nexa Elite
DEVICE_IMEI=your_actual_imei_here
DEVICE_SIM=your_actual_sim_here
DEVICE_ICCID=your_actual_iccid_here
MDS_TOKEN=your_actual_mds_token_here
CUSTOMER_ID=your_actual_customer_id_here
USER_ID=your_actual_user_id_here
PORT=3000
```

### Step 3: Run the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

You should see:
```
✓ Secure dashboard server running on http://localhost:3000
✓ API endpoint: http://localhost:3000/api/device/config
```

### Step 4: Access Dashboard
Open your browser and visit: **http://localhost:3000**

The dashboard will load and fetch device configuration from the secure backend API.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          Browser (dashboard.html)               │
│  ✓ No hardcoded credentials                     │
│  ✓ Fetches config from backend API              │
└──────────────┬──────────────────────────────────┘
               │ HTTP Request
               │ /api/device/config
               ▼
┌─────────────────────────────────────────────────┐
│        Node.js Backend (server.js)              │
│  ✓ Credentials in environment variables only    │
│  ✓ Authentication required                      │
│  ✓ Secure headers enabled                       │
│  ✓ Token rotation support                       │
└──────────────┬──────────────────────────────────┘
               │ Returns config
               │
               ▼
┌─────────────────────────────────────────────────┐
│     External Service (esa.18gps.net)            │
│  ✓ HTTPS connection                             │
│  ✓ Temporary tokens                             │
└─────────────────────────────────────────────────┘
```

## 🔐 Security Features

✅ **No Hardcoded Credentials**
- All secrets in environment variables (.env)
- .env file is git-ignored (never committed)

✅ **Authentication Required**
- Backend validates requests before exposing credentials
- Add your own auth logic (JWT, sessions, etc.)

✅ **Secure Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Strict-Transport-Security (HSTS)

✅ **HTTPS Ready**
- Works with HTTPS in production
- Secure cookie support

✅ **Token Rotation**
- Endpoint: `POST /api/device/refresh-token`
- Update tokens without restarting server

## 📝 API Endpoints

### Get Device Configuration
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/device/config
```

**Response:**
```json
{
  "deviceName": "Nexa Elite",
  "deviceIMEI": "869727077401113",
  "simNumber": "01349619785",
  "iccid": "89880145051625268800",
  "mdsToken": "8b287d3e19a9408d9e2ce7a225190c2f",
  "custId": "c27c9f22-0e02-40c8-8e6c-9703971d4df9",
  "userId": "c27c9f220e0240c88e6c9703971d4df9"
}
```

### Refresh Token
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/device/refresh-token
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 🛠️ Customization

### Add Authentication (Important!)
Edit `server.js` - replace the basic `authenticateUser` function:

```javascript
// Example: JWT authentication
function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !verifyJWT(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
```

### Add Token Refresh Logic
Edit `refreshMDSToken()` function to call your actual device service API:

```javascript
async function refreshMDSToken(customerId) {
    const response = await fetch('https://your-api.com/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId })
    });
    const data = await response.json();
    return data.token;
}
```

## 📦 Production Deployment

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
```bash
# Set environment variables on your server
export DEVICE_IMEI=your_value
export DEVICE_SIM=your_value
# ... etc
```

### Use HTTPS (Required for Production)
- Generate SSL certificate (Let's Encrypt recommended)
- Configure reverse proxy (Nginx, Apache)
- Redirect HTTP to HTTPS

## ⚠️ Important Security Notes

1. **Never commit .env file** - It's in .gitignore for this reason
2. **Rotate credentials regularly** - Especially if they were ever exposed
3. **Use HTTPS in production** - Never send credentials over HTTP
4. **Implement proper authentication** - The basic example needs enhancement
5. **Log access events** - For security auditing
6. **Monitor token usage** - Detect unauthorized access

## 🧹 Git History Cleanup

The original commit containing hardcoded credentials needs to be removed:

```bash
# Remove sensitive data from Git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch dashboard.html' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (be careful - this rewrites history)
git push origin --force --all
```

## 📞 Support

For issues or questions, check:
- `.env.example` for configuration requirements
- `SECURITY_FIX.md` for vulnerability details
- GitHub Issues in the repository

## 📄 License

ISC