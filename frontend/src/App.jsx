import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AssessmentPage from "./pages/AssessmentPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}>
          {/* Subtle Ambient Warm Orbs in Background */}
          <div
            className="animate-float"
            style={{
              position: "fixed",
              top: "-8%",
              left: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(242, 132, 130, 0.18) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0
            }}
          />
          <div
            className="animate-float"
            style={{
              position: "fixed",
              top: "30%",
              right: "-8%",
              width: 550,
              height: 550,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(157, 129, 186, 0.16) 0%, transparent 70%)",
              filter: "blur(70px)",
              pointerEvents: "none",
              zIndex: 0,
              animationDelay: "-2.5s"
            }}
          />
          <div
            className="animate-float"
            style={{
              position: "fixed",
              bottom: "10%",
              left: "20%",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244, 162, 97, 0.14) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
              animationDelay: "-4s"
            }}
          />

          {/* Navigation Bar */}
          <Navbar />

          {/* Page Routing */}
          <main style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<AssessmentPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/mindfulness" element={<MindfulnessPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
