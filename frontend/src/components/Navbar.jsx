import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  BarChart2,
  Heart,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Compass
} from "lucide-react";

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "AI Assessment", icon: Sparkles },
    { path: "/analytics", label: "Insights & Benchmarks", icon: BarChart2 },
    { path: "/mindfulness", label: "Mindfulness & Care", icon: Heart },
    { path: "/profile", label: "My Profile", icon: User }
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(250, 246, 240, 0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-subtle)",
      transition: "all var(--transition-smooth)"
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, var(--secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px var(--primary-glow)",
            color: "#FFFDFB",
            fontWeight: 800,
            fontSize: 20
          }}>
            🌸
          </div>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 22,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em"
              }}>
                MindLens
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "var(--primary-subtle)",
                color: "var(--primary)",
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(217, 112, 81, 0.2)"
              }}>
                XAI
              </span>
            </div>
            <p style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: -2,
              fontWeight: 500
            }}>
              Explainable Mental Health Sanctuary
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: "none",
          alignItems: "center",
          gap: 6,
          background: "rgba(255, 255, 255, 0.7)",
          padding: "5px 8px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid var(--border-subtle)"
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 18px",
                  borderRadius: "var(--radius-pill)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  color: active ? "#FFFDFB" : "var(--text-secondary)",
                  background: active
                    ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
                    : "transparent",
                  boxShadow: active ? "0 4px 14px var(--primary-glow)" : "none",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account Pill & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 14px 6px 8px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-pill)",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <span style={{
                  fontSize: 20,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--secondary-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(157, 129, 186, 0.2)"
                }}>
                  {userProfile?.avatar || user.avatar || "🌸"}
                </span>
                <div style={{ textAlign: "left" }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "block",
                    lineHeight: 1.2
                  }}>
                    {userProfile?.displayName || user.displayName || "User"}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: "var(--text-muted)"
                  }}>
                    {user.isGuest ? "Guest Sanctuary" : "Connected"}
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid var(--border-subtle)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: 13 }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)"
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "16px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }} className="mobile-drawer">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 15,
                  color: active ? "var(--primary)" : "var(--text-secondary)",
                  background: active ? "var(--primary-subtle)" : "transparent"
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Responsive media helper via style */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
}
