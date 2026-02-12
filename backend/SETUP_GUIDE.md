# Setup Guide: Environment Configuration

This guide covers configuration for all optional services: Cloudinary, Google Gemini AI, and BSE Star Broker.

## Quick Start

**Required for basic functionality:**
- ✅ Database (PostgreSQL)
- ✅ JWT Secret

**Optional but recommended:**
- ⚪ Cloudinary (for document uploads)
- ⚪ Google Gemini AI (for AI-powered features)
- ⚪ BSE Star Broker (for real MF orders - mock works for dev)

---

## Google Gemini AI Configuration

Gemini AI is used for intelligent features like bank statement parsing.

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (format: `AIzaSy...`)

### Step 2: Add to .env

```env
GEMINI_API_KEY="your-actual-api-key-here"
```

### Step 3: Restart Server

```bash
npm run start:dev
```

**Note:** The app will start without Gemini, but AI features will be disabled. You'll see a warning in the logs if it's not configured.

See `GEMINI_SETUP.md` for detailed instructions.

---

## Cloudinary Configuration

## Cloudinary Configuration

Cloudinary is used for document storage (PAN, Aadhaar, KYC documents, etc.).

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"** (free tier includes 25GB storage and 25GB bandwidth)
3. Complete the registration form
4. Verify your email address

### Step 2: Get Your Cloudinary Credentials

1. After logging in, you'll be taken to your **Dashboard**
2. On the dashboard, you'll see your account details:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

3. Copy these three values

### Step 3: Add Credentials to .env File

Open `backend/.env` and update these lines:

```env
CLOUDINARY_CLOUD_NAME="your-actual-cloud-name"
CLOUDINARY_API_KEY="your-actual-api-key"
CLOUDINARY_API_SECRET="your-actual-api-secret"
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME="dxyz123abc"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

### Step 4: Verify Configuration

1. Restart your backend server
2. Try uploading a document through the API
3. Check Cloudinary dashboard → **Media Library** to see uploaded files

### Cloudinary Settings (Optional)

You can configure upload presets in Cloudinary dashboard:
- Go to **Settings** → **Upload**
- Set up upload presets for different document types
- Configure allowed file types and sizes

---

## BSE Star Broker Configuration

BSE Star is a mutual fund distribution platform. **Note: This is optional** - the system will use a mock broker if credentials are not configured.

### Step 1: Check if You Have BSE Star Access

BSE Star API access is typically available to:
- Registered mutual fund distributors
- AMCs (Asset Management Companies)
- Authorized intermediaries

If you don't have BSE Star access, the system will automatically use the mock broker for development/testing.

### Step 2: Get BSE Star API Credentials

If you have BSE Star access:

1. Contact BSE Star support or your account manager
2. Request API credentials:
   - API Key
   - API Secret
   - API Base URL (usually `https://api.bse-star.com` or similar)

3. You may need to:
   - Sign an API agreement
   - Complete KYC/verification
   - Set up IP whitelisting

### Step 3: Add Credentials to .env File

Open `backend/.env` and update these lines:

```env
BSE_STAR_API_URL="https://api.bse-star.com"
BSE_STAR_API_KEY="your-actual-api-key"
BSE_STAR_API_SECRET="your-actual-api-secret"
```

**Example:**
```env
BSE_STAR_API_URL="https://api.bse-star.com"
BSE_STAR_API_KEY="BSESTAR_1234567890"
BSE_STAR_API_SECRET="secret_key_abcdefghijklmnop"
```

### Step 4: Verify Configuration

1. Restart your backend server
2. Check logs - you should see:
   - If credentials are set: "Using BSE Star broker"
   - If not set: "Using Mock broker"

### Using Mock Broker (Development)

If you don't have BSE Star credentials, the system automatically uses a mock broker that:
- Simulates order placement
- Returns mock order IDs
- Simulates order status updates
- Perfect for development and testing

**No action needed** - it works out of the box!

---

## Complete .env Example

Here's a complete `.env` file example with both configured:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/finxpert?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Cloudinary (REQUIRED for document uploads)
CLOUDINARY_CLOUD_NAME="dxyz123abc"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"

# BSE Star Broker (OPTIONAL - uses mock if not set)
BSE_STAR_API_URL="https://api.bse-star.com"
BSE_STAR_API_KEY="BSESTAR_1234567890"
BSE_STAR_API_SECRET="secret_key_abcdefghijklmnop"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

---

## Testing the Configuration

### Test Cloudinary

```bash
# Start the backend
cd backend
npm run start:dev

# Use the API to upload a document
# POST /documents/:clientId
# Body: multipart/form-data with 'file' and 'type' fields
```

### Test BSE Star (or Mock)

```bash
# Check backend logs when placing an order
# Look for broker service initialization messages
```

---

## Troubleshooting

### Cloudinary Issues

**Error: "Invalid credentials"**
- Double-check your Cloud Name, API Key, and API Secret
- Ensure no extra spaces or quotes in .env file
- Restart the server after updating .env

**Error: "Upload failed"**
- Check your Cloudinary account limits (free tier: 25GB)
- Verify file size is under 10MB
- Check file type is allowed (PDF, JPG, PNG)

### BSE Star Issues

**Using Mock Broker (Expected if no credentials)**
- This is normal if you haven't configured BSE Star
- Mock broker works for development
- To use real broker, configure credentials and restart

**API Errors**
- Verify API credentials are correct
- Check if your IP is whitelisted (if required)
- Contact BSE Star support for API documentation

---

## Security Best Practices

1. **Never commit .env file** - It's already in .gitignore
2. **Use different credentials** for development and production
3. **Rotate API secrets** periodically
4. **Use environment-specific .env files**:
   - `.env.development`
   - `.env.production`
   - `.env.staging`

---

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [BSE Star Website](https://www.bsestarmf.in/) (Contact for API access)
