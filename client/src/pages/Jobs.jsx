import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

const empty = { q: "", location: "", type: "", remote: "" };

export default function Jobs() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: params.get("q") || "",
    location: params.get("location") || "",
    type: params.get("type") || "",
    remote: params.get("remote") || "",
  });
  const [data, setData] = useState({ jobs: [], total: 0 });
  const [searches, setSearches] = useState([]);
  const [saveName, setSaveName] = useState("");
  const [error, setError] = useState("");

  function queryString(next = filters) {
    const q = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    return q.toString();
  }

  async function load(next = filters) {
    const qs = queryString(next);
    setParams(qs);
    const result = await api(`/api/jobs?${qs}`);
    setData(result);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    if (user) {
      api("/api/saved-searches")
        .then((d) => setSearches(d.searches))
        .catch(() => {});
    }
  }, [user]);

  async function saveSearch(e) {
    e.preventDefault();
    const search = await api("/api/saved-searches", {
      method: "POST",
      body: { name: saveName || "Saved search", filters },
    });
    setSearches((s) => [search.search, ...s]);
    setSaveName("");
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Open roles</h1>
      <p className="mt-1 text-mute">{data.total} live listings</p>
      {error && <p className="mt-3 text-red-700">{error}</p>}

      <form
        className="mt-6 grid gap-2 rounded-2xl border border-line bg-card p-4 md:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input className="rounded-xl border border-line bg-paper px-3 py-2" placeholder="Keyword" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input className="rounded-xl border border-line bg-paper px-3 py-2" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="rounded-xl border border-line bg-paper px-3 py-2" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">Any type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
        <select className="rounded-xl border border-line bg-paper px-3 py-2" value={filters.remote} onChange={(e) => setFilters({ ...filters, remote: e.target.value })}>
          <option value="">On-site or remote</option>
          <option value="true">Remote only</option>
          <option value="false">On-site</option>
        </select>
        <button className="rounded-xl bg-ink text-paper">Search</button>
      </form>

      {user && (
        <form onSubmit={saveSearch} className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <input className="rounded-xl border border-line bg-card px-3 py-1.5" placeholder="Name this search" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
          <button className="text-accent">Save search</button>
          {searches.map((s) => (
            <button
              key={s._id}
              type="button"
              className="rounded-full border border-line px-3 py-1"
              onClick={() => {
                const next = { ...empty, ...s.filters };
                setFilters(next);
                load(next);
              }}
            >
              {s.name}
            </button>
          ))}
        </form>
      )}

      <div className="mt-6 grid gap-3">
        {data.jobs.map((job) => (
          <Link key={job._id} to={`/jobs/${job._id}`} className="rounded-2xl border border-line bg-card p-5 hover:border-accent">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl">{job.title}</h2>
              <span className="text-sm text-mute">{job.company}</span>
            </div>
            <p className="mt-2 text-sm text-mute">
              {job.location} · {job.type}
              {job.remote ? " · remote" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills?.map((s) => (
                <span key={s} className="rounded-full bg-paper px-2 py-0.5 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {data.jobs.length === 0 && <p className="text-mute">No jobs match those filters yet.</p>}
      </div>
    </div>
  );
}
