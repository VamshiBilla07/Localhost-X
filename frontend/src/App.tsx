import { useEffect, useMemo, useState } from "react";
import { createIssue, fetchIssues, updateIssueStatus } from "./api";
import { Issue, IssueStatus } from "./types";

const statusColors: Record<IssueStatus, string> = {
  open: "#f97316",
  "in-progress": "#2563eb",
  resolved: "#16a34a"
};

function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await fetchIssues();
      setIssues(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const addIssue = async (payload: Omit<Issue, "id" | "status" | "createdAt" | "updatedAt">) => {
    const created = await createIssue(payload);
    setIssues((prev) => [created, ...prev]);
  };

  const changeStatus = async (id: string, status: IssueStatus) => {
    const updated = await updateIssueStatus(id, status);
    setIssues((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { issues, loading, error, refresh, addIssue, changeStatus };
}

function StatsCard({ issues }: { issues: Issue[] }) {
  const stats = useMemo(() => {
    return {
      total: issues.length,
      open: issues.filter((i) => i.status === "open").length,
      inProgress: issues.filter((i) => i.status === "in-progress").length,
      resolved: issues.filter((i) => i.status === "resolved").length
    };
  }, [issues]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p className="stat-value">{stats.total}</p>
        <p className="stat-label">Total Issues</p>
      </div>
      <div className="stat-card open">
        <p className="stat-value">{stats.open}</p>
        <p className="stat-label">Open</p>
      </div>
      <div className="stat-card progress">
        <p className="stat-value">{stats.inProgress}</p>
        <p className="stat-label">In Progress</p>
      </div>
      <div className="stat-card resolved">
        <p className="stat-value">{stats.resolved}</p>
        <p className="stat-label">Resolved</p>
      </div>
    </div>
  );
}

function IssueCard({ issue, onStatusChange }: { issue: Issue; onStatusChange: (status: IssueStatus) => void }) {
  const date = useMemo(() => new Date(issue.createdAt).toLocaleString(), [issue.createdAt]);
  return (
    <article className="card">
      <div className="card-header">
        <span className="pill" style={{ backgroundColor: statusColors[issue.status] }}>
          {issue.status}
        </span>
        <span className="meta">{date}</span>
      </div>
      <h3>{issue.title}</h3>
      <p className="muted">{issue.description}</p>
      <div className="grid">
        <div>
          <p className="label">Category</p>
          <p>{issue.category}</p>
        </div>
        <div>
          <p className="label">Location</p>
          <p>{issue.location}</p>
        </div>
        {issue.contact && (
          <div>
            <p className="label">Contact</p>
            <p>{issue.contact}</p>
          </div>
        )}
      </div>
      <div className="actions">
        {(["open", "in-progress", "resolved"] as IssueStatus[]).map((status) => (
          <button
            key={status}
            className={issue.status === status ? "btn secondary active" : "btn secondary"}
            onClick={() => onStatusChange(status)}
            disabled={issue.status === status}
          >
            {status}
          </button>
        ))}
      </div>
    </article>
  );
}

function IssueForm({ onSubmit }: { onSubmit: (payload: Parameters<typeof createIssue>[0]) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Safety");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGetLocation = () => {
    setGeoLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setGeoLoading(false);
        },
        (error) => {
          setError(`Geolocation error: ${error.message}`);
          setGeoLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser");
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await onSubmit({ title, description, category, location, contact: contact || undefined });
      setTitle("");
      setDescription("");
      setCategory("Safety");
      setLocation("");
      setContact("");
      setCoordinates(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">Report</p>
          <h2>New issue</h2>
        </div>
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting" : "Submit"}
        </button>
      </div>
      <label className="field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} placeholder="Brief description" />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          placeholder="Provide details..."
        />
      </label>
      <div className="grid">
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Safety</option>
            <option>Infrastructure</option>
            <option>Health</option>
            <option>Environment</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          <span>Location</span>
          <div className="location-input-wrapper">
            <input value={location} onChange={(e) => setLocation(e.target.value)} required maxLength={160} placeholder="Address or coordinates" />
            <button type="button" className="btn secondary" onClick={handleGetLocation} disabled={geoLoading}>
              {geoLoading ? "📍 Getting..." : "📍 Use My Location"}
            </button>
          </div>
          {coordinates && <p className="success">✓ Location captured</p>}
        </label>
      </div>
      <label className="field">
        <span>Contact (optional)</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="Phone or email" />
      </label>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">✓ Issue submitted successfully!</p>}
    </form>
  );
}

function IssuesFeed({ issues, loading, error, onStatusChange, onRefresh }: { issues: Issue[]; loading: boolean; error: string | null; onStatusChange: (id: string, status: IssueStatus) => void; onRefresh: () => void }) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchCategory = !filterCategory || issue.category === filterCategory;
      const matchStatus = !filterStatus || issue.status === filterStatus;
      const matchSearch = !searchTerm || issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [issues, filterCategory, filterStatus, searchTerm]);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Live feed</p>
          <h2>Recent issues</h2>
        </div>
        <button className="btn secondary" onClick={onRefresh} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={!filterCategory ? "btn secondary active" : "btn secondary"}
            onClick={() => setFilterCategory(null)}
          >
            All Categories
          </button>
          {["Safety", "Infrastructure", "Health", "Environment", "Other"].map((cat) => (
            <button
              key={cat}
              className={filterCategory === cat ? "btn secondary active" : "btn secondary"}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-buttons">
          <button
            className={!filterStatus ? "btn secondary active" : "btn secondary"}
            onClick={() => setFilterStatus(null)}
          >
            All Status
          </button>
          {(["open", "in-progress", "resolved"] as IssueStatus[]).map((status) => (
            <button
              key={status}
              className={filterStatus === status ? "btn secondary active" : "btn secondary"}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {!loading && issues.length === 0 && <p className="muted">No issues yet. Be the first to report!</p>}
      {!loading && issues.length > 0 && filteredIssues.length === 0 && <p className="muted">No issues match your filters.</p>}
      <p className="meta" style={{ marginTop: "0.5rem" }}>Showing {filteredIssues.length} of {issues.length} issues</p>
      <div className="stack">
        {filteredIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onStatusChange={(status) => onStatusChange(issue.id, status)} />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const { issues, loading, error, refresh, addIssue, changeStatus } = useIssues();
  return (
    <main className="layout">
      <header className="hero">
        <div>
          <p className="eyebrow">Community Issue Reporter</p>
          <h1>Surface problems fast, route them to action.</h1>
          <p className="muted">Submit issues with context and track status in one place.</p>
        </div>
        <div className="map-placeholder">
          <div className="map-grid" />
          <p className="muted">Map placeholder (connect to maps API later).</p>
        </div>
      </header>

      <StatsCard issues={issues} />

      <section className="two-column">
        <IssueForm onSubmit={addIssue} />
        <IssuesFeed issues={issues} loading={loading} error={error} onStatusChange={changeStatus} onRefresh={refresh} />
      </section>
    </main>
  );
}
