import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const stages = [
  { label: "Reviewing", count: 12, color: "bg-amber-400" },
  { label: "Shortlisted", count: 8, color: "bg-emerald-500" },
  { label: "Interview", count: 4, color: "bg-sky-500" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-8 md:space-y-28">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173e35] px-6 py-12 text-[#fffdf8] shadow-xl shadow-[#173e35]/10 sm:px-10 md:px-14 md:py-16 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border-[1px] border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full border-[1px] border-white/10" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.94fr] lg:gap-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-[#d2e7d8]">
              <span className="h-2 w-2 rounded-full bg-[#f28a67]" />
              A better way to find your next move
            </div>
            <h1 className="font-display mt-6 text-[2.8rem] leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Good work starts with a <span className="text-[#ef9978]">good match.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Find roles that fit. Meet people who are hiring. Keep every application moving, all in one thoughtful place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="inline-flex items-center gap-2 rounded-full bg-[#ef9978] px-5 py-3 text-sm font-semibold text-[#211b19] transition hover:bg-[#f5ad91]">
                Explore open roles <span aria-hidden="true">→</span>
              </Link>
              {!user && (
                <Link to="/register?role=recruiter" className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  I’m hiring
                </Link>
              )}
              {user?.role === "recruiter" && (
                <Link to="/recruiter/jobs/new" className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  Post a role
                </Link>
              )}
              {user?.role === "candidate" && (
                <Link to="/candidate/applications" className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  Track applications
                </Link>
              )}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
              <span className="flex items-center gap-2"><span className="text-[#ef9978]">✦</span> For people and teams</span>
              <span className="flex items-center gap-2"><span className="text-[#ef9978]">✦</span> Every application, accounted for</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[490px] lg:ml-auto">
            <div className="absolute -left-5 top-10 z-10 hidden rounded-2xl border border-[#e6e0d5] bg-[#fffdf8] px-4 py-3 shadow-lg sm:block">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6b645c]">The next step</p>
              <p className="mt-1 text-sm font-semibold text-[#173e35]">Always in the know <span className="text-[#c24d2c]">↗</span></p>
            </div>
            <div className="rounded-[1.65rem] bg-[#fffdf8] p-3 text-[#16141a] shadow-2xl shadow-black/20 sm:p-4">
              <div className="flex items-center justify-between rounded-[1.15rem] bg-[#f3eee6] px-4 py-3.5">
              <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#173e35] text-lg text-white">a.</div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6b645c]">Dashboard preview</p>
                    <p className="mt-0.5 text-sm font-semibold">Your hiring, in view</p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#1f6f5b]">● Live pipeline</span>
              </div>

              <div className="grid grid-cols-2 gap-3 px-1 py-4 sm:px-2 sm:py-5">
                <Metric label="Listing views" value="1,284" change="Across your roles" />
                <Metric label="Applications" value="86" change="Ready for review" />
              </div>

              <div className="rounded-[1.2rem] border border-[#ebe5dc] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6b645c]">Application pipeline</p>
                    <p className="mt-1 text-sm font-semibold">Senior Product Designer</p>
                  </div>
                  <span className="rounded-full bg-[#e9f2e9] px-2.5 py-1 text-[10px] font-semibold text-[#1f6f5b]">12 new</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {stages.map((stage) => (
                    <div key={stage.label} className="rounded-xl bg-[#f7f4ee] px-2.5 py-3 sm:px-3">
                      <div className={`mb-3 h-1 w-7 rounded-full ${stage.color}`} />
                      <p className="font-display text-2xl leading-none">{stage.count}</p>
                      <p className="mt-1.5 text-[10px] text-[#6b645c] sm:text-xs">{stage.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-[#ebe5dc] pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f1d4c6] text-xs font-semibold text-[#743b2c]">JM</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">Jordan Miller</p>
                    <p className="text-[10px] text-[#6b645c]">Product designer · Applied today</p>
                  </div>
                  <span className="rounded-full bg-[#e9f2e9] px-2.5 py-1 text-[10px] font-medium text-[#1f6f5b]">New</span>
                </div>
              </div>
              <p className="px-2 pb-1 pt-3 text-center text-[10px] text-[#8b8378]">A little more clarity, on both sides of the search.</p>
            </div>
            <div className="absolute -bottom-5 -right-3 -z-10 h-24 w-24 rounded-full bg-[#ef9978] sm:-right-6 sm:h-32 sm:w-32" />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#c24d2c]">A clearer way forward</p>
          <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">Less guesswork. Better next steps.</h2>
          <p className="mt-3 text-sm leading-6 text-[#6b645c] sm:text-base">A job search should feel like progress. ApplyWise gives candidates and hiring teams one shared place to make it happen.</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <Feature number="01" title="Find your fit" body="Search real openings by keyword, location, and work style. Save the searches you want to come back to." />
          <Feature number="02" title="Apply with confidence" body="Share your resume once, follow each application, and get notified when a recruiter makes a move." />
          <Feature number="03" title="Hire with clarity" body="Post a role, review applicants, and move people through a pipeline that everyone can follow." />
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#ddd4c6] bg-[#fffdf8] px-6 py-7 sm:flex-row sm:items-center sm:px-9">
        <div>
          <p className="font-display text-2xl">A better next step is waiting.</p>
          <p className="mt-1 text-sm text-[#6b645c]">Start exploring opportunities that move you forward.</p>
        </div>
        <Link to="/jobs" className="shrink-0 rounded-full bg-[#173e35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#22594c]">Browse open roles <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}

function Metric({ label, value, change }) {
  return (
    <div className="rounded-[1.1rem] border border-[#ebe5dc] px-3.5 py-3 sm:px-4">
      <p className="text-[10px] text-[#6b645c] sm:text-xs">{label}</p>
      <p className="font-display mt-1 text-2xl sm:text-3xl">{value}</p>
      <p className="mt-1 text-[9px] text-[#1f6f5b] sm:text-[10px]">{change}</p>
    </div>
  );
}

function Feature({ number, title, body }) {
  return (
    <article className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5 sm:p-6">
      <span className="font-display grid h-10 w-10 place-items-center rounded-xl bg-[#e9f2e9] text-sm text-[#1f6f5b]">{number}</span>
      <h3 className="font-display mt-5 text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6b645c]">{body}</p>
    </article>
  );
}
