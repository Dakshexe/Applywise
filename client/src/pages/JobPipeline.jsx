import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getToken } from "../api";
import { Link } from "react-router-dom";

const STATUSES = ["applied", "reviewing", "shortlisted", "rejected", "hired"];

export default function JobPipeline() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const [pipe, stats] = await Promise.all([
      api(`/api/applications/job/${id}`),
      api(`/api/jobs/${id}/analytics`),
    ]);
    setJob(pipe.job);
    setApplications(pipe.applications);
    setAnalytics(stats);
  }

  useEffect(() => {
    load().catch(console.error);
  }, [id]);

  async function setStatus(appId, status) {
    setError("");
    try {
      await api(`/api/applications/${appId}/status`, { method: "PATCH", body: { status } });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function downloadResume(appId, name) {
    const res = await fetch(`/api/applications/${appId}/resume`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      setError(result.message || "Could not download resume.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name || "resume";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!job) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-4xl">{job.title}</h1>
      <div className="mt-3 flex gap-3">
        <Link to={`/recruiter/jobs/${id}/edit`} className="rounded-full border border-line px-4 py-1.5 text-sm">Edit listing</Link>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {analytics && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Views" value={analytics.views} />
          <Stat label="Applies" value={analytics.applies} />
          <Stat label="Conversion" value={`${analytics.conversion}%`} />
          <Stat label="Shortlisted" value={analytics.byStatus.shortlisted} />
        </div>
      )}

      <div className="mt-8 grid gap-3">
        {applications.map((app) => (
          <div key={app._id} className="rounded-2xl border border-line bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl">{app.candidate.name}</h2>
                <p className="text-sm text-mute">
                  {app.candidate.headline} · {app.candidate.location}
                </p>
                {app.coverLetter && <p className="mt-3 max-w-2xl text-sm">{app.coverLetter}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <select className="rounded-xl border border-line bg-paper px-2 py-1 capitalize" value={app.status} onChange={(e) => setStatus(app._id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button className="text-sm text-accent" onClick={() => downloadResume(app._id, app.resumeName)}>
                  Download resume
                </button>
              </div>
            </div>
          </div>
        ))}
        {applications.length === 0 && <p className="text-mute">No applications yet.</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="text-sm text-mute">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}
