import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function RecruiterHome() {
  const [overview, setOverview] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api("/api/jobs/overview").then(setOverview);
    api("/api/jobs/mine").then((d) => setJobs(d.jobs));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Recruiter dashboard</h1>
          <p className="text-mute">Views, applications, and shortlists across your jobs.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="rounded-full bg-accent px-4 py-2 text-white">
          Post a job
        </Link>
      </div>

      {overview && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card label="Open jobs" value={overview.openJobs} />
          <Card label="Total views" value={overview.views} />
          <Card label="Applications" value={overview.applies} />
          <Card label="Shortlisted" value={overview.shortlisted} />
        </div>
      )}

      <div className="mt-8 grid gap-3">
        {jobs.map((job) => (
          <div key={job._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-5">
            <div>
              <h2 className="font-display text-2xl">{job.title}</h2>
              <p className="text-sm text-mute">
                {job.views} views · {job.applicationCount} applies · {job.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/recruiter/jobs/${job._id}/edit`} className="rounded-full border border-line px-4 py-1.5">Edit</Link>
              <Link to={`/recruiter/jobs/${job._id}`} className="rounded-full border border-ink px-4 py-1.5">Pipeline</Link>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-mute">No jobs yet. Post your first role.</p>}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="text-sm text-mute">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}
