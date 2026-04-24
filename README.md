# Decode My Document

Upload any confusing document — insurance policy, rental agreement, bank loan, employment contract — and get a plain-English explanation in seconds.

Built for everyday Indian users who receive complex legal documents and don't know what they're signing.

🔗 **Live Demo:** [Coming soon]

---

## What It Does

- Upload a PDF document
- Get a plain-English **summary** of what the document means
- See **red flags** and concerning clauses highlighted
- Get **questions to ask** before signing
- Results stream live — no waiting for the full response

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Frontend      | Angular 17                           |
| Backend       | Node.js, Express                     |
| AI            | Anthropic Claude (Sonnet)            |
| File handling | Multer, pdf-parse                    |
| Deployment    | Vercel (frontend), Railway (backend) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/decode-my-document.git
cd decode-my-document
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
ANTHROPIC_API_KEY=your_key_here
PORT=3000
```

Start the server:

```bash
node index.js
```

Server runs at `http://localhost:3000`

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

App runs at `http://localhost:4200`

---

## API Reference

### POST `/api/decode`

Accepts a PDF and returns a streaming AI analysis.

**Request**

```
Content-Type: multipart/form-data
Body: document (file) — PDF only, max 5MB
```

**Response**

```
Streaming plain text in this format:

SUMMARY
What the document is and what it means for you.

RED FLAGS
Concerning clauses or unfair terms to watch out for.

QUESTIONS TO ASK
Smart questions to ask before signing.
```

**Test with curl**

```bash
curl -X POST http://localhost:3000/api/decode \
  -F "document=@/path/to/your/file.pdf"
```

---

## Project Structure

```
decode-my-document/
├── backend/
│   ├── routes/
│   │   └── decode.js       # main API route
│   ├── .env                # API keys (never commit this)
│   ├── .gitignore
│   ├── index.js            # Express server entry point
│   └── package.json
├── frontend/
│   └── src/
│       └── app/            # Angular components
└── README.md
```

---

## Author

**Kiran** — Frontend developer building AI-powered products

[LinkedIn](https://www.linkedin.com/in/bhanu-kiran-jonnapalli-lkdin/) · [GitHub](https://github.com/bhanukiran-jonnapalli/decode-my-document)
