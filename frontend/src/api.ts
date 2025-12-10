import { Issue, IssueStatus } from "./types";

const headers = { "Content-Type": "application/json" };

export async function fetchIssues(): Promise<Issue[]> {
  const res = await fetch("/api/issues");
  if (!res.ok) throw new Error("Failed to load issues");
  const data = await res.json();
  return data.issues ?? [];
}

export async function createIssue(input: {
  title: string;
  description: string;
  category: string;
  location: string;
  contact?: string;
}): Promise<Issue> {
  const res = await fetch("/api/issues", {
    method: "POST",
    headers,
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to submit issue");
  }
  const data = await res.json();
  return data.issue;
}

export async function updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
  const res = await fetch(`/api/issues/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update status");
  }
  const data = await res.json();
  return data.issue;
}
