import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/jobs/${id}`)
      .then((d) => setJob(d.job))
      .catch((err) => setError(err.message));
  }, [id]);

  async function apply(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData();
    form.append("resume", file);
    form.append("coverLetter", coverLetter);
    try {
      await api(`/api/applications/job/${id}`, { method: "POST", body: form, form: true });
      setMessage("Application sent. Track it from My applications.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !job) return <p className="text-red-700">{error}</p>;
  if (!job) return <p>Loading…</p>;

  return (
    <article className="grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
      <div>
        <p className="text-sm text-mute">{job.company}</p>
        <h1 className="font-display text-4xl">{job.title}</h1>
        <p className="mt-2 text-mute">
          {job.location} · {job.type}
          {job.remote ? " · remote" : ""} · {job.views} views
        </p>
        <p className="mt-6 whitespace-pre-wrap leading-7">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills?.map((s) => (
            <span key={s} className="rounded-full bg-card px-3 py-1 text-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
      <aside className="h-fit rounded-3xl border border-line bg-card p-5">
        {user?.role === "candidate" ? (
          <form onSubmit={apply}>
            <h2 className="font-display text-2xl">Apply</h2>
            <label className="mt-4 block text-sm">
              Resume (PDF or Word)
              <input className="mt-1 block w-full text-sm" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} required />
            </label>
            <label className="mt-4 block text-sm">
              Cover letter
              <textarea className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" rows="5" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
            </label>
            {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mt-3 text-sm text-accent-2">{message}</p>}
            <button className="mt-4 w-full rounded-full bg-accent py-2 text-white">Submit application</button>
          </form>
        ) : user?.role === "recruiter" ? (
          <div>
            <p>This is a public listing. Manage applicants from your dashboard.</p>
            <Link to="/recruiter" className="mt-4 inline-block text-accent">
              Recruiter home
            </Link>
          </div>
        ) : (
          <div>
            <p>Sign in as a candidate to apply.</p>
            <Link to="/login" className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-paper">
              Log in
            </Link>
          </div>
        )}
      </aside>
    </article>
  );
}
