import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import AllFacilities from "./pages/AllFacilities";
import FacilityDetails from "./pages/FacilityDetails";
import MyBookings from "./pages/MyBookings";
import AddFacility from "./pages/AddFacility";
import ManageMyFacilities from "./pages/ManageMyFacilities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Save current path to state to redirect back after successful login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Redirect if already logged in
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const fromPath = location.state?.from || "/";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to={fromPath} replace />;
  }

  return children;
}

function MainLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="container" style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/facilities" element={<PageTransition><AllFacilities /></PageTransition>} />
            <Route path="/facility/:id" element={<PageTransition><FacilityDetails /></PageTransition>} />

            {/* Guest Only Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <PageTransition><Login /></PageTransition>
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <PageTransition><Register /></PageTransition>
                </GuestRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <PageTransition><MyBookings /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-facility"
              element={
                <ProtectedRoute>
                  <PageTransition><AddFacility /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-my-facilities"
              element={
                <ProtectedRoute>
                  <PageTransition><ManageMyFacilities /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="/manage-facilities" element={<Navigate to="/manage-my-facilities" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)"
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}
