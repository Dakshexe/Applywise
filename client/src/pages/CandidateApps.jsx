import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const colors = {
  applied: "bg-paper",
  reviewing: "bg-amber-50",
  shortlisted: "bg-emerald-50",
  rejected: "bg-red-50",
  hired: "bg-sky-50",
};

export default function CandidateApps() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api("/api/applications/me").then((d) => setApplications(d.applications));
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl">My applications</h1>
      <div className="mt-6 grid gap-3">
        {applications.map((app) => (
          <div key={app._id} className={`rounded-2xl border border-line p-5 ${colors[app.status]}`}>
            <div className="flex flex-wrap justify-between gap-2">
              <Link to={`/jobs/${app.job?._id}`} className="font-display text-2xl">
                {app.job?.title}
              </Link>
              <span className="text-sm capitalize">{app.status}</span>
            </div>
            <p className="text-sm text-mute">{app.job?.company}</p>
          </div>
        ))}
        {applications.length === 0 && <p className="text-mute">You have not applied yet.</p>}
      </div>
    </div>
  );
}
