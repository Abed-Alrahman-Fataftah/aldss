import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ConsentPage from "./pages/onboarding/ConsentPage";
import BaselineSurveyPage from "./pages/onboarding/BaselineSurveyPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TrackPage from "./pages/dashboard/TrackPage";
import ModulePage from "./pages/dashboard/ModulePage";
import WeeklySurveyPage from "./pages/dashboard/WeeklySurveyPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ParticipantDetailPage from "./pages/admin/ParticipantDetailPage";
import ProgressPage from "./pages/dashboard/ProgressPage";
import ExitSurveyPage from "./pages/dashboard/ExitSurveyPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/onboarding/survey" element={<BaselineSurveyPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/track/:trackId"
        element={
          <ProtectedRoute>
            <TrackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/:moduleId"
        element={
          <ProtectedRoute>
            <ModulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/weekly-survey"
        element={
          <ProtectedRoute>
            <WeeklySurveyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/participant/:userId"
        element={
          <ProtectedRoute>
            <ParticipantDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exit-survey"
        element={
          <ProtectedRoute>
            <ExitSurveyPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
