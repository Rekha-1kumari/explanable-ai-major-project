import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AuthPage() {
  const { login, register, guestLogin, user, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to profile
  if (user) {
    navigate("/profile");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        if (!email || !password) throw new Error("Email and password are required.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        await register(email, password, displayName);
      }

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D97051", "#F28482", "#B5838D"]
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await guestLogin();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#E07A5F", "#B5838D"]
      });
      navigate("/");
    } catch (err) {
      setError("Failed to enter guest sanctuary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "60px auto 100px",
      padding: "0 24px"
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        padding: "44px 36px",
        background: "rgba(255, 255, 255, 0.94)",
        border: "1.5px solid var(--border-card)",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Emblem */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            margin: "0 auto 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            color: "#FFF",
            boxShadow: "0 8px 24px var(--primary-glow)"
          }}>
            🌸
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
            {mode === "signin" ? "Welcome Back to MindLens" : "Begin Your Wellness Journey"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
            {mode === "signin"
              ? "Access your assessments, emotional trends, and mindful reflections"
              : "Create your confidential mental health sanctuary profile"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          background: "var(--bg-canvas)",
          padding: 4,
          borderRadius: "var(--radius-pill)",
          marginBottom: 28,
          border: "1px solid var(--border-subtle)"
        }}>
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-pill)",
              fontSize: 14,
              fontWeight: 600,
              background: mode === "signin" ? "#FFFDFB" : "transparent",
              color: mode === "signin" ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: mode === "signin" ? "var(--shadow-sm)" : "none"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-pill)",
              fontSize: 14,
              fontWeight: 600,
              background: mode === "signup" ? "#FFFDFB" : "transparent",
              color: mode === "signup" ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: mode === "signup" ? "var(--shadow-sm)" : "none"
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            background: "var(--cat-suicidal-bg)",
            border: "1px solid rgba(214, 64, 69, 0.3)",
            borderRadius: "var(--radius-md)",
            color: "var(--cat-suicidal)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                Your Name / Preferred Moniker
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  placeholder="e.g., Aria Thorne"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1.5px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 14
                  }}
                />
                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 15 }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14
                }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 15 }} />
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14
                }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 15 }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: 15, marginBottom: 18 }}
          >
            <span>{loading ? "Authenticating..." : mode === "signin" ? "Sign In to Sanctuary" : "Create My Sanctuary Account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "18px 0",
          color: "var(--text-muted)",
          fontSize: 12
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          <span>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        {/* Guest 1-Click Sanctuary */}
        <button
          onClick={handleGuest}
          disabled={loading}
          className="btn-outline"
          style={{ width: "100%", padding: "12px", fontSize: 14, justifyContent: "center" }}
        >
          <Sparkles size={16} color="var(--secondary)" />
          <span>Continue Instantly as Guest</span>
        </button>

        {/* Firebase Indicator Notice */}
        <div style={{
          marginTop: 24,
          padding: "12px 14px",
          background: "var(--bg-canvas)",
          borderRadius: "var(--radius-md)",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.5,
          textAlign: "center"
        }}>
          <ShieldCheck size={14} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} color="var(--primary)" />
          {isFirebaseConfigured
            ? "Connected to live Firebase Auth & Firestore Cloud DB"
            : "Protected via MindLens Secure Local Firebase Provider"}
        </div>
      </div>
    </div>
  );
}
