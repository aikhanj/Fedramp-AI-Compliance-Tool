# Kamstif

**Khan and Mason's startup that is fun!**

FedRAMP compliance automation powered by AI. Generate System Security Plan (SSP) documents automatically using GPT-4o and Supabase.

## 🚀 Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   # Copy the example file
   cp .env.local.example .env.local

   # Add your keys (see ENV_SETUP.md for details)
   ```

3. **Run the dev server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS + shadcn/ui

## 🔑 Environment Setup

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions on:

- Getting Supabase credentials
- Getting OpenAI API key
- Configuring auth redirects

## 📖 API Endpoints

- `POST /api/system` - Create a new system
- `POST /api/intake` - Save intake data for a system
- `POST /api/generate` - Generate FedRAMP SSP sections with AI

## 🗄️ Database Schema

Required Supabase tables:

- `systems` - Store system information
- `intake` - Store intake questionnaire data
- `runs` - Track generation runs
- `sections` - Store generated SSP sections

---

_MVP built with ❤️ by Khan J_
