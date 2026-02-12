# Google Gemini AI Setup

The FinXpert backend uses Google Gemini AI for intelligent features like bank statement parsing and AI-powered insights.

## Is Gemini Required?

**No, Gemini is optional.** The application will start without it, but certain features will be disabled:
- ❌ Bank statement AI parsing
- ❌ AI-powered insurance gap analysis
- ❌ AI-generated financial insights

Other features will work normally without Gemini.

## Getting a Gemini API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the API key** (it will look like: `AIzaSy...`)

## Configuration

Add the API key to your `.env` file:

```env
GEMINI_API_KEY="your-actual-api-key-here"
```

## Verification

After adding the API key:

1. **Restart the backend server**
2. **Check the logs** - you should see:
   ```
   [GeminiService] Gemini AI service initialized successfully
   ```

If you see:
```
[GeminiService] WARN: GEMINI_API_KEY environment variable is not set. AI features will be disabled.
```

Then the API key is not configured correctly.

## Testing

Once configured, test the AI service by importing a bank statement through the API:
- POST `/bank/import/:clientId`
- Upload a PDF or Excel bank statement
- The AI will parse and categorize transactions automatically

## Free Tier Limits

Google Gemini API has a generous free tier:
- 60 requests per minute
- Sufficient for development and moderate production use

## Troubleshooting

**Error: "Gemini AI is not initialized"**
- Check that `GEMINI_API_KEY` is set in `.env`
- Restart the server after adding the key
- Verify the API key is correct (no extra spaces)

**Error: "API quota exceeded"**
- You've hit the rate limit
- Wait a minute and try again
- Consider upgrading to a paid plan for higher limits

**Error: "Invalid API key"**
- Double-check the API key in `.env`
- Make sure there are no quotes around the key in `.env`
- Regenerate the key from Google AI Studio if needed
