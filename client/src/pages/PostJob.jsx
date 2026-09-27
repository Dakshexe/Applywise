import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../api";

const initial = {
  title: "",
  company: "",
  location: "",
  type: "full-time",
  remote: false,
  salaryMin: "",
  salaryMax: "",
  skills: "",
  description: "",
  status: "open",
};

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api(`/api/jobs/${id}`).then(({ job }) => setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      remote: job.remote,
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      skills: (job.skills || []).join(", "),
      description: job.description,
      status: job.status,
    })).catch((err) => setError(err.message));
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api(id ? `/api/jobs/${id}` : "/api/jobs", {
        method: id ? "PATCH" : "POST",
        body: {
          ...form,
          salaryMin: Number(form.salaryMin) || 0,
          salaryMax: Number(form.salaryMax) || 0,
          skills: form.skills,
        },
      });
      navigate(id ? `/recruiter/jobs/${id}` : "/recruiter");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl rounded-3xl border border-line bg-card p-8">
      <h1 className="font-display text-3xl">{id ? "Edit job" : "Post a job"}</h1>
      {error && <p className="mt-3 text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
        <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <label className="text-sm">
          Type
          <select className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </label>
        <Field label="Salary min" type="number" value={form.salaryMin} onChange={(v) => setForm({ ...form, salaryMin: v })} />
        <Field label="Salary max" type="number" value={form.salaryMax} onChange={(v) => setForm({ ...form, salaryMax: v })} />
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} />
        Remote friendly
      </label>
      {id && (
        <label className="mt-4 block text-sm">
          Listing status
          <select className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="open">Open to applications</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      )}
      <Field label="Skills (comma separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
      <label className="mt-4 block text-sm">
        Description
        <textarea className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" rows="7" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </label>
      <button className="mt-6 rounded-full bg-ink px-5 py-2 text-paper">{id ? "Save changes" : "Publish"}</button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="mt-4 block text-sm">
      {label}
      <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
