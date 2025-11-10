# FedRAMP AI Compliance Tool

An intelligent web application that automates FedRAMP System Security Plan (SSP) generation using AI. Built to streamline government compliance workflows and reduce documentation overhead for security teams.

## Overview

This application leverages OpenAI's GPT-4 to automatically generate FedRAMP compliance documentation based on a simple intake questionnaire. Users answer questions about their system's security posture, and the AI generates detailed SSP sections covering required controls like Access Management, Cryptographic Protection, Audit Events, and more.

**Key Features:**
- **AI-Powered Generation**: Automatically creates compliance narratives using GPT-4o-mini
- **Streamlined Intake**: Simple questionnaire captures essential system security information
- **Secure Authentication**: Passwordless magic link authentication via Supabase
- **Real-Time Processing**: Multi-step workflow with progress tracking
- **Structured Output**: Generates organized SSP sections with narratives and evidence

## Tech Stack

### Frontend
- **Next.js 15** (App Router with React Server Components)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for accessible, composable UI components

### Backend
- **Next.js API Routes** for serverless functions
- **Supabase** for PostgreSQL database and authentication
- **OpenAI API** for AI-powered content generation

### Infrastructure
- **Supabase Database**: Stores systems, intake data, generation runs, and output sections
- **Row-Level Security (RLS)**: Ensures data isolation between users
- **Magic Link Auth**: Passwordless authentication flow

## Architecture

```
User Flow:
1. Magic link authentication (Supabase Auth)
2. Intake questionnaire (System info + Security controls)
3. AI processing (GPT-4 generates SSP sections)
4. Results page (View and export generated documentation)

API Structure:
- POST /api/system → Creates new system record
- POST /api/intake → Saves questionnaire responses
- POST /api/generate → Triggers AI generation workflow
```

## Database Schema

**systems** - Core system information
- `id`, `name`, `impact_level`, `user_id`, `created_at`

**intake** - Security questionnaire responses
- `id`, `system_id`, `json` (MFA, encryption, access review settings)

**runs** - Generation execution tracking
- `id`, `system_id`, `status`, `error`, `created_at`

**sections** - Generated SSP content
- `id`, `run_id`, `control_id`, `narrative`, `evidence`, `citations`

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fedramp-ai-compliance-tool.git
   cd fedramp-ai-compliance-tool
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your credentials (see [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase project:
   ```bash
   # Execute SUPABASE_SCHEMA.sql in Supabase SQL Editor
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**
   ```
   http://localhost:3000
   ```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/system` | POST | Creates a new system record with name and impact level |
| `/api/intake` | POST | Saves intake questionnaire data for a system |
| `/api/generate` | POST | Initiates AI generation of SSP sections for a system |

## Project Structure

```
app/
├── api/
│   ├── generate/route.ts    # AI generation endpoint
│   ├── intake/route.ts      # Intake submission endpoint
│   └── system/route.ts      # System creation endpoint
├── auth/callback/           # OAuth callback handler
├── intake/page.tsx          # Questionnaire interface
├── results/page.tsx         # Generated SSP viewer
└── page.tsx                 # Authentication landing page

components/
├── ui/                      # shadcn/ui components
├── control-card.tsx         # SSP section display card
├── intake-form.tsx          # Questionnaire form
└── progress-tracker.tsx     # Generation status indicator

lib/
└── supabase/               # Supabase client utilities
```

## Security Considerations

- **Row-Level Security (RLS)**: All database tables enforce user-based access control
- **Magic Link Authentication**: Passwordless login reduces credential-based attacks
- **Environment Variables**: Sensitive keys stored securely outside version control
- **Server-Side API Calls**: OpenAI API key never exposed to client

## Future Enhancements

- Export to .docx format for Word compatibility
- Additional FedRAMP control families (RA, CA, SI, etc.)
- Custom control mapping and template management
- Multi-system comparison and reporting
- Integration with GRC platforms

## Development Notes

This is an MVP demonstrating the viability of AI-assisted compliance documentation. The current implementation covers a subset of FedRAMP controls as a proof of concept.

Built with modern web development best practices including TypeScript for type safety, React Server Components for performance, and a component-driven architecture for maintainability.

## License

built by aikhan jumashukurov princeton cs · ai researcher · kyrgyz government innovation recognition.

**Purpose**: Portfolio project demonstrating full-stack development, AI integration, and compliance domain knowledge

built by [aikhan jumashukurov](https://aikhanjumashukurov.com)
princeton cs · ai researcher · kyrgyz government innovation recognition.