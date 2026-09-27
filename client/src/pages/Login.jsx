import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/jobs");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-3xl border border-line bg-card p-8">
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-1 text-mute">Use your ApplyWise account.</p>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <label className="mt-6 block text-sm">
        Email
        <input
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </label>
      <label className="mt-4 block text-sm">
        Password
        <input
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </label>
      <button className="mt-6 w-full rounded-full bg-ink py-2.5 text-paper">Log in</button>
      <p className="mt-4 text-sm text-mute">
        New here? <Link to="/register" className="text-accent">Create an account</Link>
      </p>
    </form>
  );
}
