# Echo — Private AI Journal

Echo is an AI-powered journaling application designed to help people reflect on their thoughts, understand their emotions, and notice patterns over time.

Instead of treating journaling as a place to simply store entries, Echo uses Google Gemini to turn each entry into a structured reflection and lets users continue exploring their thoughts through contextual conversations.

**Live app:** https://echo-private-ai-journal.ai.studio  
**Repository:** https://github.com/mohammed-saad-git/echo-ai-journal

---

## What Echo does

- **Write journal entries** — Capture thoughts, experiences, and everyday reflections.
- **AI-powered reflections** — Get a structured response with a summary, emotions, themes, observations, possible patterns, a reflection question, and a grounded note of encouragement.
- **Continue the conversation** — Ask follow-up questions about an entry and explore it through a multi-turn conversation with Echo.
- **Spot patterns over time** — Analyze multiple entries to surface recurring themes, recent patterns, and possible shifts in perspective.
- **Journal history** — Browse previous entries, open individual entries, and delete entries.
- **Demo experience** — Explore the application using a separate demo session and sample journal data.

Echo is intended for personal reflection. It is **not** a therapist, diagnostic tool, or substitute for professional mental-health care.

## Screens and core workflow

1. Sign in or create an account.
2. Write and save a journal entry.
3. Receive an AI-generated reflection.
4. Continue exploring the entry in a conversation with Echo.
5. Review journal history and look for recurring themes and patterns.

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling and UI | Tailwind CSS, Motion, Lucide |
| AI | Google Gemini via `@google/genai` |
| Authentication | Firebase Authentication |
| Database | Google Cloud Firestore |
| Backend | Node.js, Express, TypeScript |
| Secret management | Google Cloud Secret Manager |
| Deployment | Docker, Google Cloud Run |
| Package manager / lockfile | Bun lockfile is included; npm scripts are provided |

## Architecture

```text
┌──────────────────────────────┐
│         React client         │
│  Journal · Reflection · Chat │
│       History · Patterns     │
└──────────────┬───────────────┘
               │
       Firebase Authentication
               │
               ▼
┌──────────────────────────────┐
│       Express API server     │
│                              │
│  /api/reflect                │
│  /api/chat                   │
│  /api/patterns               │
│  /api/auth/demo-session      │
│  /api/health                 │
└──────────────┬───────────────┘
               │
       Google Gemini API
               │
               ▼
┌──────────────────────────────┐
│     Google Cloud services    │
│  Firestore · Secret Manager  │
│          Cloud Run           │
└──────────────────────────────┘
```

The frontend uses Firebase Authentication and Firestore. AI requests are sent to the Express backend, which calls Gemini. The backend can read the Gemini API key from an environment variable or Google Cloud Secret Manager.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- A Firebase project with Authentication and Cloud Firestore enabled
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/mohammed-saad-git/echo-ai-journal.git
cd echo-ai-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a starting point:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
```

`GEMINI_API_KEY` is used by the server and should never be exposed in frontend code or committed to the repository.

The repository includes `firebase-applet-config.json`, which the client and server use for Firebase project configuration. For your own deployment, replace it with configuration for your Firebase project and make sure the corresponding Firebase services are enabled.

### 4. Configure Firebase

In your Firebase project:

1. Enable the sign-in providers used by the application (Google and email/password).
2. Create or configure a Cloud Firestore database.
3. Review and deploy the rules in `firestore.rules`.
4. Confirm that the Firebase configuration in `firebase-applet-config.json` matches your project.

The Firestore rules are designed to scope user profiles, journal entries, and conversations to the authenticated user's UID. The demo data uses a separate collection.

### 5. Run locally

```bash
npm run dev
```

The development server starts on the port configured by `PORT`, defaulting to `3000`.

### 6. Build for production

```bash
npm run build
npm start
```

The production build creates the Vite frontend bundle and bundles the Express server into `dist/server.cjs`.

### Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the frontend and server |
| `npm start` | Run the production server |
| `npm run preview` | Preview the Vite build |
| `npm run lint` | Run the TypeScript compiler without emitting files |
| `npm run clean` | Remove generated build output |

## API overview

The Express server exposes the following routes:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Returns service status and architecture information |
| `POST` | `/api/auth/demo-session` | Creates a time-limited demo session |
| `POST` | `/api/reflect` | Generates a structured reflection for a journal entry |
| `POST` | `/api/chat` | Continues a multi-turn conversation using journal context |
| `POST` | `/api/patterns` | Analyzes entries for recurring themes and changes over time |

The reflection, chat, and patterns endpoints require an authenticated session. AI endpoints use Gemini on the server, rather than requiring the Gemini API key in the browser.

## AI behaviour and design choices

Echo's reflection prompts are designed to be calm, thoughtful, and non-judgmental.

For a journal entry, the reflection endpoint asks Gemini to return:

- A concise summary
- Primary emotions with intensity ratings
- Key themes
- Specific observations
- Possible recurring patterns
- A question for further reflection
- A brief note of encouragement

The conversation endpoint can use the user's recent journal history as context. The patterns endpoint looks across multiple entries for recurring themes, recent patterns, and possible shifts in perspective.

The prompts explicitly instruct the model not to diagnose mental-health conditions or present interpretations as clinical facts. AI-generated reflections are still fallible; users should treat them as prompts for thought, not objective conclusions.

## Deployment

The repository includes a `Dockerfile` for containerized deployment. The application is structured to run on Google Cloud Run.

At a high level:

1. Build the Docker image.
2. Configure the Cloud Run service and its runtime service account.
3. Provide the Gemini API key through Google Cloud Secret Manager or a server-side environment variable.
4. Grant the Cloud Run service account permission to access the required secret.
5. Configure the Firebase project and Firestore rules.
6. Deploy the container and set the appropriate `APP_URL` and `GOOGLE_CLOUD_PROJECT` values.

Do not put private API keys in frontend environment variables or commit them to Git.

## Security notes

Echo handles personal journal content, so security deserves particular attention.

- Keep Gemini credentials on the server.
- Apply and test Firestore security rules before deployment.
- Use a dedicated, strongly generated `DEMO_SERVER_SECRET` in production; do not rely on a source-code default.
- Review the authentication middleware in `server.ts` before production use. In its current form, the fallback path can accept a decoded token payload when Firebase identity lookup fails without independently verifying the token signature. That fallback should be removed or replaced with cryptographic Firebase token verification.
- Avoid describing the application as end-to-end encrypted unless that architecture is implemented and independently verified.

## Project context

Echo was built for the **Google Cloud Gen AI Academy APAC 2026 — Cohort 3 Ideathon**, powered by Hack2skill.

The project explores how generative AI and Google Cloud services can be combined to create a more reflective journaling experience.

## Contributing

Suggestions, bug reports, and improvements are welcome. If you plan to make a substantial change, open an issue first to discuss the proposed direction.

## License

No license is currently specified in this repository. Unless a license is added, the default copyright restrictions apply and reuse, modification, and redistribution are not automatically granted.
