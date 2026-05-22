import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage   from "./pages/LandingPage";
import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage    from "./pages/UploadPage";
import ItineraryPage from "./pages/ItineraryPage";
import SharedPage    from "./pages/SharedPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Spinner /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Spinner() {
  return (
    <div style={{ width: 40, height: 40, border: "3px solid #e4ddd0", borderTopColor: "#c8862a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/share/:token" element={<SharedPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload"    element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
