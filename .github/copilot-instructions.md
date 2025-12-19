# Matthew - AI Coding Agent Instructions

## Project Overview

**Matthew** is a Next.js tax calculation chatbot for Nigerian tax regulations (2026). It combines natural language chat via Gemini AI with structured form inputs for three tax types: PAYE (salary), CIT (business), and CGT (crypto/investments).

## Architecture

### Core Data Flow

1. **Chat Component** (`components/chat/index.tsx`) - Main orchestrator managing conversation state and dispatching to sub-components
2. **Gemini Integration** (`lib/gemini-client.ts`) - Sends message history + system prompt to Google Gemini API (model: `gemini-2.5-flash`)
3. **Local Storage** - Conversations persisted via `localStorage` key `matthew_conversations` with auto-reload on app start
4. **Backend API** (`https://matthew-3.onrender.com`) - Calculates taxes using request data; hooked via `lib/hooks.ts` mutations

### Key Components

- **Chat UI**: `ChatInput` (textarea), `MessagesDisplay` (markdown rendering), `ChatSidebar` (conversation history)
- **Forms**: Three form types in `components/custom-ui/forms/` - `BusinessTaxForm`, `PayeForm`, `CryptoTaxForm`
- **Dialogs**: `AuditDialog` manages payment schedules and receipt uploads triggered by calculation detection

### Type System

All tax payloads follow `TaxApiPayload` interface (`lib/types.ts`): includes `taxType` (PAYE|CIT|CGT), `income`, `businessProfit`, `capitalGains`, `expenses` fields. Forms convert user input via `createTaxApiPayload()` in `lib/form-helpers.ts`.

## Critical Patterns

### Calculation Detection

Gemini responses are parsed by `detectCalculationResponse()` in `lib/gemini-client.ts` to extract tax amounts. Detected calculations automatically trigger an audit dialog button. Pattern: Look for currency values and tax keywords in response text.

### Message Flow

1. User input → `createUserMessage()` creates message object with timestamp
2. Sent to Gemini with entire message history as context
3. Response parsed for calculations → `createAssistantMessage()` with optional `calculationData` field
4. Conversation updated via `addMessageToConversation()` and re-saved to localStorage

### Form Submission

Forms emit summary text + API payload via custom handlers. Payload is converted from form-specific data (e.g., `monthlySalary * 12` for PAYE annual income). Tax response includes `breakdown` object with component taxes (`cit`, `developmentLevy`, etc.).

## Development Workflows

### Environment Setup

```bash
npm install
npm run dev  # Starts on localhost:3000
```

- **Required ENV**: `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`
- Backend API must be running; deployed at `matthew-3.onrender.com`

### Build & Deploy

```bash
npm run build   # Next.js build
npm run start   # Production start
npm run lint    # ESLint check
```

### Testing Tax Calculations

1. Input text query (e.g., "I earn ₦150,000/month, what's my tax?")
2. Verify Gemini response contains Nigerian naira values
3. Check for "Create Payment Schedule" button appearance
4. Submit form and verify API response includes `totalTax` and `breakdown`

## Important Conventions

### System Prompt Strategy

The entire Nigerian tax ruleset lives in `lib/system-prompt.ts` as `MATTHEW_SYSTEM_PROMPT` - this is injected into every Gemini request. **Do not modify tax formulas without understanding the 2026 Nigerian tax code.** Current rules: PAYE brackets (0-21%), CIT 30%, CGT 10%.

### State Management

- **No Redux**: Uses React hooks + localStorage for persistence
- **React Query**: Mutations via `@tanstack/react-query` for API calls (see `useCalculateTax()` pattern)
- **Sidebar Provider**: `components/ui/sidebar.tsx` manages mobile/desktop layout via Radix UI

### Component Patterns

- **Client Components**: All chat components use `"use client"` (Next.js 19 server components)
- **Markdown Rendering**: `react-markdown` used in `MessagesDisplay` for AI responses
- **Auto-resize Textareas**: Custom hook `useAutoResizeTextarea.ts` for input field expansion

## Integration Points

- **Gemini API**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Backend Tax Calc**: `POST /tax/calculate` → returns `totalTax`, `breakdown`, `summary`
- **Related endpoints** (future): `/explain`, `/simulate`, `/generate-report`, `/chat`

## Files to Know

- `lib/system-prompt.ts` - Tax ruleset; modify only if regulations change
- `lib/gemini-client.ts` - API communication; defines message format and calculation detection
- `components/chat/index.tsx` - Conversation orchestration; implements localStorage persistence
- `lib/hooks.ts` - React Query mutations; logging patterns for debugging
- `lib/form-helpers.ts` - Payload construction; add new form types here

## Common Tasks

**Adding a new tax type**: Create form in `components/custom-ui/forms/`, add case to `createFormSummary()` and `createTaxApiPayload()`, update `FormType` union in `lib/types.ts`.

**Debugging API calls**: Check console for `🔗 [API]` and `🎣 [Hook]` prefixed logs in `lib/api.ts` and `lib/hooks.ts`.

**Modifying chat behavior**: Edit system prompt in `lib/system-prompt.ts` or calculation detection logic in `lib/gemini-client.ts`.
