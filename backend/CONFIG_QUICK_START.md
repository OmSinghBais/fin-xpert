# Quick Configuration Guide

## Step 1: Copy .env.example to .env

```bash
cd backend
cp .env.example .env
```

## Step 2: Configure Cloudinary (Required)

### Get Cloudinary Credentials:
1. Sign up at https://cloudinary.com (free tier available)
2. Go to Dashboard → Copy your credentials:
   - Cloud Name
   - API Key  
   - API Secret

### Update .env:
```env
CLOUDINARY_CLOUD_NAME="your-actual-cloud-name"
CLOUDINARY_API_KEY="your-actual-api-key"
CLOUDINARY_API_SECRET="your-actual-api-secret"
```

## Step 3: Configure BSE Star Broker (Optional)

**If you have BSE Star API access:**
```env
BSE_STAR_API_KEY="your-api-key"
BSE_STAR_API_SECRET="your-api-secret"
```

**If you don't have access:**
- Leave these blank or remove them
- The system will automatically use a mock broker (perfect for development)

## Step 4: Verify Configuration

Run the configuration checker:

```bash
npm run check:config
```

This will show you:
- ✅ What's configured correctly
- ⚠️  What needs attention
- ❌ What's missing

## Step 5: Start the Server

```bash
npm run start:dev
```

---

## Quick Reference

### Required for Production:
- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `JWT_SECRET` - Change from default
- ✅ `CLOUDINARY_*` - For document uploads

### Optional:
- ⚪ `BSE_STAR_*` - For real broker integration (mock works for dev)

### See Full Guide:
- Detailed instructions: `SETUP_GUIDE.md`
- Environment template: `.env.example`
