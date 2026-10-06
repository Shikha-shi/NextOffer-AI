
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfile from "./pages/StudentProfile";
import Resume from "./pages/Resume";
import SkillGap from "./pages/SkillGap";
import JobRecommendations from "./pages/JobRecommendations";
import CareerRoadmap from "./pages/CareerRoadmap";
import LearningResources from "./pages/LearningResources";
import CareerRecommendations from "./pages/CareerRecommendations";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<StudentProfile />} />
  <Route path="/resume" element={<Resume />} />
  <Route path="/skills" element={<SkillGap />} />
  <Route path="/careers" element={<CareerRecommendations />} />
  <Route path="/jobs" element={<JobRecommendations />} />
  <Route path="/career-roadmap" element={<CareerRoadmap />} />
  <Route
    path="/learning-resources"
    element={<LearningResources />}
  />
  <Route path="/assistant" element={<AIAssistant />} />
</Route>

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
