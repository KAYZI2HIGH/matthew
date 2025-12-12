# MATTHEW - Gemini AI Tax Calculator Setup

## Integration Complete ✅

Your chat application is now fully integrated with Google Gemini AI for natural language tax calculations.

## What's Been Integrated

### 1. **Gemini AI Chat Backend**

- `lib/gemini-client.ts` - Handles communication with Gemini API
- Includes system prompt with Nigerian 2026 tax formulas
- Automatic calculation detection

### 2. **Calculation Detection**

- Messages with tax amounts are automatically detected
- Extracted data includes: tax type, amount, currency, installments
- Dynamic payment schedules based on calculation

### 3. **Audit Dialog Integration**

- Opens when user clicks "Create Payment Schedule & View Audit Options"
- **Reminder Tab**: Shows payment schedule from calculation
- **New Audit Tab**: Upload receipt for payment proof
- **Audit History Tab**: Blockchain proof of payments

### 4. **Enhanced Chat Flow**

1.  User asks tax question in natural language
2.  Gemini AI calculates using system prompt formulas
3.  If calculation detected, button appears on response
4.  User clicks button to open audit dialog with data
5.  User can create payment schedule and upload receipts

## Required Setup

### Get Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev)
2. Click "Get API Key"
3. Create new API key in Google Cloud
4. Copy the key

### Configure Environment

Update `.env.local` with your Gemini API key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_key_here
```

## Features Now Available

✅ **Natural Language Processing**

- Users can ask about taxes in plain English
- AI understands context and calculates accordingly

✅ **Automatic Calculation Detection**

- Detects when Gemini provides tax calculations
- Shows "Create Payment Schedule" button automatically

✅ **Payment Schedule Management**

- Dynamic schedules based on calculated amounts
- Installment splitting (default 3-4 installments)
- Due date suggestions

✅ **Receipt Verification**

- Upload receipts in New Audit tab
- AI validates authenticity, price matching, vendor
- Simulated blockchain proof storage

✅ **Persistent Storage**

- All conversations saved to localStorage
- Auto-opens recent chat on app restart
- Full message history retained

## Testing the Integration

### Test Case 1: Simple Tax Query

Input: "I earn ₦150,000 monthly. What's my tax?"

Expected:

1. Gemini calculates PAYE tax
2. Shows breakdown with amount
3. "Create Payment Schedule" button appears
4. Click button → Payment schedule visible in audit dialog

### Test Case 2: Business Income

Input: "My business made ₦5 million profit. How much tax do I owe?"

Expected:

1. Gemini calculates CIT (30.5%)
2. Shows detailed breakdown
3. Payment schedule button appears
4. Dialog shows quarterly payment plan

### Test Case 3: Investment Gains

Input: "I sold crypto for ₦1 million gain. What's my tax liability?"

Expected:

1. Gemini calculates CGT (10%)
2. Shows capital gains calculation
3. Button to create audit
4. Receipt upload section ready

## Files Modified/Created

- ✅ `lib/types.ts` - Added calculation data tracking
- ✅ `lib/gemini-client.ts` - NEW: Gemini API integration
- ✅ `lib/system-prompt.ts` - NEW: Complete tax formula system prompt
- ✅ `components/chat/index.tsx` - Integrated Gemini AI, removed old hooks
- ✅ `components/chat/MessagesDisplay.tsx` - Added audit button for calculations
- ✅ `components/custom-ui/AuditDialog.tsx` - Accepts dynamic calculation data
- ✅ `.env.local` - NEW: Environment variables template

## API Structure

### Gemini Request

```typescript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY

{
  system_instruction: { parts: [{ text: MATTHEW_SYSTEM_PROMPT }] },
  contents: [
    { role: "user", parts: [{ text: "..." }] },
    { role: "model", parts: [{ text: "..." }] }
  ]
}
```

### Response Handling

- AI response is parsed
- Automatically checks for calculation keywords
- Extracts amount, tax type, dates
- Creates clickable button if calculation found

## Next Steps (Optional Enhancements)

1. **Database Integration**

   - Move calculations from localStorage to backend
   - Store blockchain proofs in database

2. **Actual Blockchain**

   - Implement real Celo blockchain for payment proofs
   - Store transaction hashes in audit history

3. **Form Submission Integration**

   - Connect form submissions to Gemini
   - Get AI explanation for form-based calculations

4. **Receipt OCR**

   - Use vision AI to extract receipt data
   - Automated price matching with calculations

5. **Export Reports**
   - Generate PDF tax summaries
   - Export payment schedules

## Troubleshooting

**Error: "GEMINI_API_KEY not configured"**

- Check `.env.local` file
- Restart the dev server after updating env
- Ensure key has no extra spaces

**No button appears after calculation**

- Check browser console for errors
- Verify calculation detection keywords in response
- Look for ₦ symbol or amount format

**Gemini not responding**

- Check API quota in Google Cloud console
- Verify API key is active
- Check network tab for failed requests

## Cost Considerations

- Gemini API has free tier (60 requests/minute)
- Upgrade for higher limits as needed
- Monitor usage in Google Cloud console

---

**Status**: ✅ Fully Integrated with Gemini AI
**API Key**: Required in `.env.local`
**Build Status**: ✅ Compiles successfully
