import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { GradientBackground } from "./components/ui/gradient-background";
import ShaderBackground from "./components/ui/shader-background";

function BackgroundManager() {
  const location = useLocation();
  if (location.pathname === "/") {
    return <ShaderBackground />;
  }
  return <GradientBackground className="fixed inset-0 z-[-10]" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BackgroundManager />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
