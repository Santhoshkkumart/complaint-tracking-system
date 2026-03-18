import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
const Login = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const GradientBackground = lazy(() => import("./components/ui/gradient-background").then((module) => ({
  default: module.GradientBackground,
})));
const ShaderBackground = lazy(() => import("./components/ui/shader-background"));

function AppLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#020617] text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
    </div>
  );
}

function BackgroundManager() {
  const location = useLocation();
  if (location.pathname === "/") {
    return (
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={null}>
      <GradientBackground className="fixed inset-0 z-[-10]" />
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BackgroundManager />
        <Suspense fallback={<AppLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
