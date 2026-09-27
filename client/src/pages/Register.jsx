import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: requestedRole === "recruiter" ? "recruiter" : "candidate", company: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate(form.role === "recruiter" ? "/recruiter" : "/jobs");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-3xl border border-line bg-card p-8">
      <h1 className="font-display text-3xl">Join ApplyWise</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <label className="mt-6 block text-sm">
        Full name
        <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <label className="mt-4 block text-sm">
        Email
        <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </label>
      <label className="mt-4 block text-sm">
        Password
        <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
      </label>
      <fieldset className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {["candidate", "recruiter"].map((role) => (
          <label key={role} className={`cursor-pointer rounded-xl border px-3 py-2 ${form.role === role ? "border-accent bg-paper" : "border-line"}`}>
            <input type="radio" className="mr-2" checked={form.role === role} onChange={() => setForm({ ...form, role })} />
            {role}
          </label>
        ))}
      </fieldset>
      {form.role === "recruiter" && (
        <label className="mt-4 block text-sm">
          Company
          <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </label>
      )}
      <button className="mt-6 w-full rounded-full bg-ink py-2.5 text-paper">Create account</button>
      <p className="mt-4 text-sm text-mute">
        Already have an account? <Link to="/login" className="text-accent">Log in</Link>
      </p>
    </form>
  );
}
