import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import CandidateApps from "./pages/CandidateApps.jsx";
import RecruiterHome from "./pages/RecruiterHome.jsx";
import PostJob from "./pages/PostJob.jsx";
import JobPipeline from "./pages/JobPipeline.jsx";
import Profile from "./pages/Profile.jsx";

function Guard({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="p-8">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/profile"
          element={
            <Guard>
              <Profile />
            </Guard>
          }
        />
        <Route
          path="/candidate/applications"
          element={
            <Guard role="candidate">
              <CandidateApps />
            </Guard>
          }
        />
        <Route
          path="/recruiter"
          element={
            <Guard role="recruiter">
              <RecruiterHome />
            </Guard>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <Guard role="recruiter">
              <PostJob />
            </Guard>
          }
        />
        <Route
          path="/recruiter/jobs/:id/edit"
          element={
            <Guard role="recruiter">
              <PostJob />
            </Guard>
          }
        />
        <Route
          path="/recruiter/jobs/:id"
          element={
            <Guard role="recruiter">
              <JobPipeline />
            </Guard>
          }
        />
      </Route>
    </Routes>
  );
}
