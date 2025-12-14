import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Types kept small for hackathon speed.
type IssueStatus = "open" | "in-progress" | "resolved";

type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contact?: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
};

const issues: Issue[] = [];

const requiredFields: Array<keyof Omit<Issue, "id" | "status" | "createdAt" | "updatedAt">> = [
  "title",
  "description",
  "category",
  "location"
];

app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Server Running</title>
        <style>
          body { font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
          .container { text-align: center; }
          h1 { font-size: 3rem; margin: 0; }
          p { font-size: 1.2rem; opacity: 0.9; }
          .endpoints { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-top: 2rem; text-align: left; }
          .endpoints code { background: rgba(0,0,0,0.3); padding: 0.3rem 0.6rem; border-radius: 4px; display: block; margin: 0.5rem 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ API is Running</h1>
          <p>Backend server is live on port ${PORT}</p>
          <div class="endpoints">
            <strong>Available endpoints:</strong>
            <code>GET /health</code>
            <code>GET /api/issues</code>
            <code>POST /api/issues</code>
            <code>PATCH /api/issues/:id/status</code>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/issues", (_req: Request, res: Response) => {
  res.json({ issues });
});

app.get("/api/issues/:id", (req: Request, res: Response) => {
  const issue = issues.find((item) => item.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }
  return res.json({ issue });
});

app.post("/api/issues", (req: Request, res: Response) => {
  const payload = req.body ?? {};
  const missing = requiredFields.filter((field) => !payload[field]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(",")}` });
  }

  const now = new Date().toISOString();
  const issue: Issue = {
    id: uuid(),
    title: String(payload.title).slice(0, 120),
    description: String(payload.description).slice(0, 2000),
    category: String(payload.category).slice(0, 80),
    location: String(payload.location).slice(0, 160),
    contact: payload.contact ? String(payload.contact).slice(0, 120) : undefined,
    status: "open",
    createdAt: now,
    updatedAt: now
  };

  issues.unshift(issue);
  return res.status(201).json({ issue });
});

app.patch("/api/issues/:id/status", (req: Request, res: Response) => {
  const issue = issues.find((item) => item.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const status: IssueStatus | undefined = req.body?.status;
  if (!status || !["open", "in-progress", "resolved"].includes(status)) {
    return res.status(400).json({ error: "Status must be one of open|in-progress|resolved" });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  return res.json({ issue });
});

// Only start server if not running in serverless environment (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    // Lightweight logging for hackathon use.
    console.log(`API listening on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
