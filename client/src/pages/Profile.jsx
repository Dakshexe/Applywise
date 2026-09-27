import { useState } from "react";
import { api, getToken } from "../api";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    company: user?.company || "",
    location: user?.location || "",
    headline: user?.headline || "",
    skills: (user?.skills || []).join(", "),
  });
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeBusy, setResumeBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const data = await api("/api/auth/me", {
      method: "PATCH",
      body: {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    });
    setUser(data.user);
    setMessage("Saved.");
  }

  async function uploadResume() {
    if (!resumeFile) return;
    setResumeBusy(true);
    setResumeError("");
    setResumeMessage("");
    const data = new FormData();
    data.append("resume", resumeFile);
    try {
      const result = await api("/api/profile/resume", { method: "POST", body: data, form: true });
      setUser(result.user);
      setResumeFile(null);
      setResumeMessage("Resume uploaded successfully.");
      const input = document.getElementById("profile-resume");
      if (input) input.value = "";
    } catch (err) {
      setResumeError(err.message);
    } finally {
      setResumeBusy(false);
    }
  }

  async function downloadResume() {
    setResumeError("");
    try {
      const response = await fetch("/api/profile/resume", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Could not download resume.");
      }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = user.resumeName || "resume";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setResumeError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-8">
      <h1 className="font-display text-3xl">Profile</h1>
      <p className="text-mute capitalize">{user?.role}</p>
      {["name", "headline", "location", "company", "skills"].map((key) => (
        <label key={key} className="mt-4 block text-sm capitalize">
          {key}
          <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </label>
      ))}
      {message && <p className="mt-3 text-accent-2">{message}</p>}
      <button className="mt-6 rounded-full bg-ink px-5 py-2 text-paper">Save</button>
      {user?.role === "candidate" && (
        <section className="mt-8 border-t border-line pt-6" aria-labelledby="resume-heading">
          <h2 id="resume-heading" className="font-display text-2xl">Resume</h2>
          <p className="mt-1 text-sm text-mute">Upload a PDF or Word document (up to 5 MB) to keep it with your profile.</p>
          {user.resumeName ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper px-4 py-3">
              <p className="min-w-0 truncate text-sm" title={user.resumeName}>Current file: <span className="font-medium">{user.resumeName}</span></p>
              <button type="button" onClick={downloadResume} className="shrink-0 text-sm font-medium text-accent">Download</button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-mute">No resume uploaded yet.</p>
          )}
          <label htmlFor="profile-resume" className="mt-4 block text-sm font-medium">{user.resumeName ? "Choose a replacement" : "Choose a resume"}</label>
          <input id="profile-resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-paper file:px-4 file:py-2 file:font-medium file:text-ink" />
          {resumeFile && <p className="mt-2 text-xs text-mute">Selected: {resumeFile.name}</p>}
          {resumeError && <p role="alert" className="mt-3 text-sm text-red-700">{resumeError}</p>}
          {resumeMessage && <p role="status" className="mt-3 text-sm text-accent-2">{resumeMessage}</p>}
          <button type="button" disabled={!resumeFile || resumeBusy} onClick={uploadResume} className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">
            {resumeBusy ? "Uploading…" : user.resumeName ? "Replace resume" : "Upload resume"}
          </button>
        </section>
      )}
    </form>
  );
}
