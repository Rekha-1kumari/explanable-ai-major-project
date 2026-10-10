import React from "react";
import { Heart, PhoneCall, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-subtle)",
      marginTop: 80,
      padding: "60px 24px 36px"
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
        marginBottom: 48
      }}>
        {/* Column 1: Brand & Compassion */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 24 }}>🌸</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--text-primary)"
            }}>
              MindLens
            </span>
          </div>
          <p style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            marginBottom: 20
          }}>
            An empathetic, transparent mental health support platform powered by
            explainable machine learning. Designed to foster emotional clarity,
            mindful self-reflection, and compassionate growth.
          </p>
          <div className="glass-pill" style={{ display: "inline-flex", gap: 8, fontSize: 13, color: "var(--primary)" }}>
            <Sparkles size={15} />
            <span>Explainable AI (XAI) Transparent Attribution</span>
          </div>
        </div>

        {/* Column 2: Immediate Crisis Support */}
        <div>
          <h4 style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <PhoneCall size={18} color="var(--primary)" />
            <span>Immediate Crisis Helplines</span>
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
            If you or a loved one are experiencing acute distress, free and confidential support is available 24/7:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="tel:9999666555"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "var(--primary-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(217, 112, 81, 0.2)",
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              <span>Vandrevala Foundation (India)</span>
              <span style={{ fontFamily: "monospace" }}>9999 666 555</span>
            </a>
            <a
              href="tel:14416"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "var(--secondary-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(157, 129, 186, 0.2)",
                color: "var(--secondary)",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              <span>Tele-MANAS (Govt of India)</span>
              <span style={{ fontFamily: "monospace" }}>14416</span>
            </a>
            <a
              href="tel:988"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "var(--accent-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(244, 162, 97, 0.2)",
                color: "var(--accent-warm)",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              <span>988 Suicide & Crisis Lifeline (US/Global)</span>
              <span style={{ fontFamily: "monospace" }}>988</span>
            </a>
          </div>
        </div>

        {/* Column 3: Ethical AI & Privacy */}
        <div>
          <h4 style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <Shield size={18} color="var(--secondary)" />
            <span>Ethical Safeguards & Privacy</span>
          </h4>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 14 }}>
            MindLens operates under strict privacy principles. Your assessment history
            is stored directly in your personal authenticated profile with zero third-party telemetry.
          </p>
          <div style={{
            padding: "12px 16px",
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.6
          }}>
            <strong>Important Clinical Notice:</strong> MindLens is an academic & assistive AI tool. It does not provide clinical medical diagnosis or prescription. Always consult a licensed healthcare professional.
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        paddingTop: 24,
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        fontSize: 13,
        color: "var(--text-muted)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Crafted with</span>
          <Heart size={14} color="var(--primary)" fill="var(--primary)" />
          <span>for mental wellness & transparent artificial intelligence.</span>
        </div>
        <div>
          <span>MindLens Platform • Multi-Model TF-IDF & Classical ML Engine</span>
        </div>
      </div>
    </footer>
  );
}
