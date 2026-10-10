import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  Wind,
  Heart,
  Eye,
  Hand,
  Volume2,
  Smile,
  BookOpen,
  Send,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle,
  PhoneCall
} from "lucide-react";

const BREATHING_PRESETS = [
  { id: "box", name: "4-4-4 Box Breathing", inhale: 4, hold: 4, exhale: 4, pause: 4, desc: "Restores neurological balance during stress or overwhelm." },
  { id: "calm", name: "4-7-8 Deep Soothing", inhale: 4, hold: 7, exhale: 8, pause: 2, desc: "Calms sympathetic nervous system and eases racing thoughts." },
  { id: "reset", name: "3-3 Quick Reset", inhale: 3, hold: 2, exhale: 3, pause: 1, desc: "A rapid 1-minute centering breath between daily tasks." }
];

export default function MindfulnessPage() {
  const { user, recordReflection, reflections } = useAuth();

  // Breathing state
  const [activePreset, setActivePreset] = useState(BREATHING_PRESETS[0]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Ready"); // Inhale, Hold, Exhale, Pause
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Reflection Journal state
  const [journalText, setJournalText] = useState("");
  const [journalMood, setJournalMood] = useState("Calm");
  const [journalSaved, setJournalSaved] = useState(false);

  // Grounding Tool step
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { count: 5, sense: "Things you can SEE around you", icon: Eye, prompt: "Look around slowly. Notice textures, shapes, or gentle warm light in your room." },
    { count: 4, sense: "Things you can physically TOUCH", icon: Hand, prompt: "Feel your feet on the ground, the texture of your clothes, or a warm cup." },
    { count: 3, sense: "Things you can HEAR right now", icon: Volume2, prompt: "Listen beyond your room. Gentle breeze, hum of appliances, or distant birds." },
    { count: 2, sense: "Things you can SMELL", icon: Sparkles, prompt: "Inhale through your nose. Scent of wood, coffee, soap, or clean air." },
    { count: 1, sense: "Thing you are GRATEFUL for in yourself", icon: Heart, prompt: "Honor your quiet courage, resilience, and willingness to pause today." }
  ];

  // Breathing Timer Effect
  useEffect(() => {
    let timer = null;
    if (breathingActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next breath phase
          if (breathPhase === "Ready" || breathPhase === "Rest") {
            setBreathPhase("Inhale");
            return activePreset.inhale;
          } else if (breathPhase === "Inhale") {
            setBreathPhase("Hold Gently");
            return activePreset.hold;
          } else if (breathPhase === "Hold Gently") {
            setBreathPhase("Exhale Slowly");
            return activePreset.exhale;
          } else if (breathPhase === "Exhale Slowly") {
            setCyclesCompleted((c) => c + 1);
            if (activePreset.pause > 0) {
              setBreathPhase("Rest");
              return activePreset.pause;
            } else {
              setBreathPhase("Inhale");
              return activePreset.inhale;
            }
          }
          return 4;
        });
      }, 1000);
    } else {
      setBreathPhase("Ready");
      setCountdown(activePreset.inhale);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathPhase, activePreset]);

  const toggleBreathing = () => {
    if (!breathingActive) {
      setBreathPhase("Inhale");
      setCountdown(activePreset.inhale);
      setBreathingActive(true);
    } else {
      setBreathingActive(false);
      setBreathPhase("Ready");
    }
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase("Ready");
    setCountdown(activePreset.inhale);
    setCyclesCompleted(0);
  };

  const handleSaveReflection = async (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    if (user) {
      await recordReflection(journalText.trim(), journalMood);
    }
    setJournalSaved(true);
    setJournalText("");
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#D97051", "#F28482", "#9D81BA", "#E79E7E"]
    });
    setTimeout(() => setJournalSaved(false), 4000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }} className="animate-fade-in">
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 48px" }}>
        <div className="glass-pill" style={{
          marginBottom: 16,
          background: "var(--primary-subtle)",
          border: "1px solid rgba(217, 112, 81, 0.2)",
          color: "var(--primary)"
        }}>
          <Wind size={15} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Mindfulness Sanctuary & Regulative Care</span>
        </div>

        <h1 style={{ fontSize: "clamp(30px, 4.5vw, 44px)", marginBottom: 14 }}>
          Regulate, Breathe & <span style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Find Peace</span>
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Somatic regulation practices, interactive guided breathing, and mindful
          self-reflection to bring your autonomic nervous system back to safety.
        </p>
      </div>

      {/* Section 1: Interactive Breathing Orb Sanctuary */}
      <section className="glass-card" style={{ padding: "40px", marginBottom: 48, textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
            Rhythmic Breathing Orb
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Follow the expanding and contracting warm halo. Match your gentle inhalation and exhalation.
          </p>
        </div>

        {/* Preset Selector */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
          {BREATHING_PRESETS.map((p) => {
            const isSel = activePreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePreset(p);
                  resetBreathing();
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 13,
                  fontWeight: 600,
                  background: isSel
                    ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
                    : "rgba(255, 255, 255, 0.8)",
                  color: isSel ? "#FFF" : "var(--text-secondary)",
                  border: isSel ? "1px solid transparent" : "1px solid var(--border-subtle)",
                  boxShadow: isSel ? "0 4px 16px var(--primary-glow)" : "none"
                }}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Breathing Halo & Orb */}
        <div style={{
          position: "relative",
          width: 260,
          height: 260,
          margin: "0 auto 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Animated Glow Layer */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: breathPhase.includes("Inhale")
                ? "radial-gradient(circle, rgba(242, 132, 130, 0.4) 0%, rgba(217, 112, 81, 0.1) 70%, transparent 100%)"
                : breathPhase.includes("Hold")
                ? "radial-gradient(circle, rgba(157, 129, 186, 0.45) 0%, rgba(181, 131, 141, 0.1) 70%, transparent 100%)"
                : "radial-gradient(circle, rgba(231, 158, 126, 0.35) 0%, rgba(244, 162, 97, 0.08) 70%, transparent 100%)",
              transform: breathPhase.includes("Inhale")
                ? "scale(1.25)"
                : breathPhase.includes("Hold")
                ? "scale(1.2)"
                : "scale(0.92)",
              transition: "transform 3.5s cubic-bezier(0.4, 0, 0.2, 1), background 1s ease"
            }}
          />

          {/* Central Physical Orb */}
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFFDFB 0%, #FDF3ED 100%)",
              border: "3px solid rgba(242, 132, 130, 0.4)",
              boxShadow: "0 10px 30px rgba(217, 112, 81, 0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              transform: breathPhase.includes("Inhale")
                ? "scale(1.12)"
                : breathPhase.includes("Hold")
                ? "scale(1.1)"
                : "scale(0.94)",
              transition: "transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4
            }}>
              {breathPhase}
            </span>
            <span style={{
              fontSize: 44,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              lineHeight: 1
            }}>
              {countdown}s
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <button
            onClick={toggleBreathing}
            className="btn-primary"
            style={{ padding: "14px 36px", fontSize: 16 }}
          >
            {breathingActive ? (
              <>
                <Pause size={18} />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Begin Breathing</span>
              </>
            )}
          </button>

          <button
            onClick={resetBreathing}
            className="btn-outline"
            style={{ padding: "12px 20px" }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {cyclesCompleted > 0 && (
          <div style={{ marginTop: 24, fontSize: 13, color: "var(--secondary)", fontWeight: 600 }}>
            🌸 Completed {cyclesCompleted} calming breath cycles. Wonderful work!
          </div>
        )}
      </section>

      {/* Section 2: 5-4-3-2-1 Sensory Grounding Tool */}
      <section className="glass-card" style={{ padding: "40px", marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--secondary-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--secondary)"
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>5-4-3-2-1 Sensory Grounding Tool</h2>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Anchor your awareness in the present moment to break cycles of rumination or panic
            </span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 28
        }}>
          {groundingSteps.map((step, idx) => {
            const isCurrent = groundingStep === idx;
            const Icon = step.icon;
            return (
              <button
                key={idx}
                onClick={() => setGroundingStep(idx)}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  textAlign: "left",
                  background: isCurrent ? "var(--secondary-subtle)" : "rgba(255, 255, 255, 0.7)",
                  border: isCurrent
                    ? "1.5px solid rgba(157, 129, 186, 0.4)"
                    : "1px solid var(--border-subtle)",
                  boxShadow: isCurrent ? "0 4px 14px var(--secondary-glow)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: isCurrent ? "var(--secondary)" : "rgba(0,0,0,0.06)",
                    color: isCurrent ? "#FFF" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12
                  }}>
                    {step.count}
                  </span>
                  <Icon size={16} color={isCurrent ? "var(--secondary)" : "var(--text-muted)"} />
                </div>
                <span style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500, color: "var(--text-primary)" }}>
                  Step {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Grounding Prompt Card */}
        <div style={{
          padding: "28px",
          background: "var(--bg-surface)",
          border: "1.5px solid rgba(157, 129, 186, 0.25)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20
        }}>
          <div style={{ maxWidth: 700 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--secondary)",
              letterSpacing: "0.08em"
            }}>
              Focus {groundingSteps[groundingStep].count} Objects / Senses
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 4, marginBottom: 8, color: "var(--text-primary)" }}>
              {groundingSteps[groundingStep].sense}
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {groundingSteps[groundingStep].prompt}
            </p>
          </div>

          <button
            onClick={() => setGroundingStep((s) => (s + 1) % groundingSteps.length)}
            className="btn-secondary"
            style={{ padding: "12px 24px" }}
          >
            <span>{groundingStep === 4 ? "Complete Grounding 🌸" : "Next Sense →"}</span>
          </button>
        </div>
      </section>

      {/* Section 3: Reflection Notepad & Firestore Journal */}
      <section className="glass-card" style={{ padding: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--primary-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)"
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Mindful Reflection Journal</h2>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Pen down gratitude, release heavy thoughts, and track personal growth
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveReflection}>
          {/* Mood Selector Chips */}
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 10 }}>
              Current Emotional Climate:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Calm 🕊️", "Grateful ☀️", "Overwhelmed 🍃", "Hopeful 🌱", "Reflective 🍵", "Tired 🌙"].map((m) => {
                const label = m.split(" ")[0];
                const isSel = journalMood === label;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setJournalMood(label)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: 13,
                      fontWeight: 600,
                      background: isSel ? "var(--primary-subtle)" : "rgba(255, 255, 255, 0.8)",
                      border: isSel ? "1.5px solid var(--primary)" : "1px solid var(--border-subtle)",
                      color: isSel ? "var(--primary)" : "var(--text-secondary)"
                    }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            rows={4}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What is one compassionate thing you can tell yourself right now? Or what weight are you willing to put down today?..."
            style={{
              width: "100%",
              padding: "18px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "1.5px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--text-primary)",
              marginBottom: 16
            }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {user ? "✨ Synchronized securely with your Firebase profile" : "🌸 Instant local sanctuary journal"}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {journalSaved && (
                <span className="glass-pill" style={{ color: "var(--primary)", fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle size={15} />
                  <span>Reflection recorded!</span>
                </span>
              )}
              <button
                type="submit"
                disabled={!journalText.trim()}
                className="btn-primary"
                style={{ padding: "12px 28px", opacity: !journalText.trim() ? 0.6 : 1 }}
              >
                <Send size={15} />
                <span>Save Reflection</span>
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
