import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    api("/api/notifications")
      .then((data) => {
        setUnread(data.unread);
        setNotes(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  async function markRead() {
    setOpen((v) => !v);
    if (!open && unread) {
      await api("/api/notifications/read", { method: "PATCH" });
      setUnread(0);
      setNotes((list) => list.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-card/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-2xl tracking-tight">
            ApplyWise
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? "text-accent" : "text-mute hover:text-ink")}>
              Jobs
            </NavLink>
            {user?.role === "candidate" && (
              <NavLink to="/candidate/applications" className={({ isActive }) => (isActive ? "text-accent" : "text-mute hover:text-ink")}>
                My applications
              </NavLink>
            )}
            {user?.role === "recruiter" && (
              <NavLink to="/recruiter" className={({ isActive }) => (isActive ? "text-accent" : "text-mute hover:text-ink")}>
                Recruiter
              </NavLink>
            )}
            {user ? (
              <>
                <button className="relative text-mute hover:text-ink" onClick={markRead}>
                  Inbox
                  {unread > 0 && (
                    <span className="absolute -right-3 -top-2 rounded-full bg-accent px-1.5 text-[10px] text-white">{unread}</span>
                  )}
                </button>
                <NavLink to="/profile" className="text-mute hover:text-ink">
                  {user.name}
                </NavLink>
                <button
                  className="rounded-full border border-line px-3 py-1"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="rounded-full bg-ink px-3 py-1 text-paper">
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
        {open && user && (
          <div className="mx-auto max-w-6xl px-4 pb-3">
            <div className="rounded-xl border border-line bg-card p-3 text-sm shadow-sm">
              {notes.length === 0 && <p className="text-mute">No notifications yet.</p>}
              {notes.slice(0, 6).map((n) => (
                <p key={n._id} className="border-b border-line/70 py-2 last:border-0">
                  <span className="font-medium">{n.title}</span>
                  <span className="text-mute"> — {n.body}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
