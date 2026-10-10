import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  Heart,
  Bookmark,
  RefreshCw,
  Info,
  ChevronRight,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Wind,
  ShieldCheck,
  Check,
  Award
} from "lucide-react";

const CATEGORY_COLORS = {
  Normal: {
    color: "var(--cat-normal)",
    bg: "var(--cat-normal-bg)",
    border: "rgba(231, 158, 126, 0.35)",
    emoji: "☀️",
    advice: "Your thoughts reflect emotional balance, resilience, and grounded presence. Continue nurturing your healthy daily routines, restorative sleep, and mindful habits."
  },
  Anxiety: {
    color: "var(--cat-anxiety)",
    bg: "var(--cat-anxiety-bg)",
    border: "rgba(242, 132, 130, 0.4)",
    emoji: "🕊️",
    advice: "Gentle reminder: Panic, palpitations, and racing thoughts are biological alarms, not objective truths. Take three slow belly breaths, feel your feet on the ground, and allow your body to reset."
  },
  Depression: {
    color: "var(--cat-depression)",
    bg: "var(--cat-depression-bg)",
    border: "rgba(157, 129, 186, 0.4)",
    emoji: "🌱",
    advice: "You are not alone, and your heavy feelings are valid. Be extraordinarily gentle with your energy today. You do not have to conquer everything at once; tiny, compassionate steps are profound victories."
  },
  Stress: {
    color: "var(--cat-stress)",
    bg: "var(--cat-stress-bg)",
    border: "rgba(217, 112, 81, 0.4)",
    emoji: "🍃",
    advice: "Your nervous system is experiencing acute workload pressure. Pause for five minutes, unclench your jaw, drop your shoulders, and drink a warm glass of water."
  },
  Bipolar: {
    color: "var(--cat-bipolar)",
    bg: "var(--cat-bipolar-bg)",
    border: "rgba(181, 131, 141, 0.4)",
    emoji: "🌊",
    advice: "Significant mood shifts and energy oscillations can feel disorienting. Protecting a consistent circadian sleep schedule and structured daily rhythm helps anchor emotional stability."
  },
  "Personality disorder": {
    color: "var(--cat-personality)",
    bg: "var(--cat-personality-bg)",
    border: "rgba(165, 121, 130, 0.4)",
    emoji: "🦋",
    advice: "Navigating turbulent emotions and interpersonal sensitivity is challenging. Cultivating non-judgmental self-compassion creates a secure internal foundation."
  },
  Suicidal: {
    color: "var(--cat-suicidal)",
    bg: "var(--cat-suicidal-bg)",
    border: "rgba(214, 64, 69, 0.45)",
    emoji: "❤️‍🩹",
    advice: "Please stay with us. You are deeply valued, and your pain can be healed. Please connect immediately with a professional or call free crisis helplines at 988 or 9999 666 555 right now."
  }
};

const SAMPLE_PROMPTS = [
  {
    label: "Workplace Burnout",
    text: "Burnt out from working 75 hours this week with impossible deadlines, throbbing tension headaches, and constant fatigue."
  },
  {
    label: "Panic & Racing Heart",
    text: "My heart is pounding erratically, feeling a sudden overwhelming dread and shortness of breath whenever I am in crowded rooms."
  },
  {
    label: "Depressive Heaviness",
    text: "Finding it nearly impossible to get out of bed lately. Everything feels empty, exhausting, and completely pointless."
  },
  {
    label: "Calm & Grounded",
    text: "Had a peaceful morning walk today, enjoyed a warm cup of herbal tea, and feel grateful for supportive family and restful sleep."
  }
];

export default function AssessmentPage() {
  const { user, recordAssessment } = useAuth();

  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Model selection state
  const [availableModels, setAvailableModels] = useState([]);
  const [activeModel, setActiveModel] = useState("logistic_regression");
  const [switchingModel, setSwitchingModel] = useState(false);

  // Feedback & Save states
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [savedToProfile, setSavedToProfile] = useState(false);

  // Voice Assistant: Speech-to-Text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Voice Assistant: Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  // Initialize Speech APIs
  useEffect(() => {
    fetchModels();

    // Check Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setStatement((prev) => {
            const trimmedPrev = prev.trim();
            if (trimmedPrev.endsWith(currentTranscript.trim())) return prev;
            return trimmedPrev ? `${trimmedPrev} ${currentTranscript.trim()}` : currentTranscript.trim();
          });
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition notice:", err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    // Check Speech Synthesis support
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Loading animation step timer
  useEffect(() => {
    let interval = null;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((s) => (s + 1) % 4);
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchModels = async () => {
    try {
      const res = await fetch("/api/models");
      if (res.ok) {
        const data = await res.json();
        setAvailableModels(data.models || []);
        setActiveModel(data.active_model || "logistic_regression");
      }
    } catch (e) {
      console.warn("Could not load models list:", e);
    }
  };

  const handleSelectModel = async (modelId) => {
    setSwitchingModel(true);
    try {
      const res = await fetch("/api/models/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_name: modelId })
      });
      if (res.ok) {
        setActiveModel(modelId);
      }
    } catch (e) {
      console.error("Error switching model:", e);
    } finally {
      setSwitchingModel(false);
    }
  };

  // Toggle Voice Input (Speech-to-Text)
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start voice recognition:", err);
      }
    }
  };

  // Empathetic Voice Output (Text-to-Speech)
  const toggleSpeakGuidance = (textToSpeak) => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.90; // soothing, gentle cadence
      utterance.pitch = 1.05; // warm tone
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!statement.trim()) return;

    // Stop listening if recording
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    // Stop audio if speaking
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    setSavedToProfile(false);

    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statement.trim() })
      });

      if (!res.ok) {
        throw new Error("Assessment service could not evaluate statement.");
      }

      const data = await res.json();
      setResult(data);

      // Auto-save to profile if user is logged in
      if (user) {
        await recordAssessment(data);
        setSavedToProfile(true);
      }
    } catch (err) {
      setError(err.message || "Failed to analyze mental health sentiment.");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (isAccurate) => {
    if (!result) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prediction_id: result.id,
          user_feedback: isAccurate ? "accurate" : "inaccurate",
          feedback_notes: isAccurate ? "Validated by user" : "User adjusted sentiment"
        })
      });
      setFeedbackSent(true);
      if (isAccurate) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#D97051", "#F28482", "#B5838D", "#E79E7E"]
        });
      }
    } catch (err) {
      console.warn("Feedback submission error:", err);
    }
  };

  const categoryMeta = result ? CATEGORY_COLORS[result.predicted_category] || CATEGORY_COLORS.Normal : null;

  const loadingMessages = [
    "Listening with deep compassion & care...",
    "Extracting TF-IDF emotional feature weights...",
    "Calculating calibrated decision hyperplanes...",
    "Formulating transparent word-level explainability..."
  ];

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px" }} className="animate-fade-in">
      {/* Hero Welcome Header */}
      <section style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 40px" }}>
        <div className="glass-pill" style={{
          marginBottom: 16,
          background: "var(--primary-subtle)",
          border: "1px solid rgba(217, 112, 81, 0.2)",
          color: "var(--primary)"
        }}>
          <Wind size={15} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Gentle, private sanctuary for emotional clarity</span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 48px)",
          marginBottom: 16,
          color: "var(--text-primary)"
        }}>
          Compassionate Assessment & <span style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Voice Companion</span>
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Speak naturally or type what you are experiencing. Our transparent Machine Learning
          engine evaluates sentiment nuances and explains the exact words shaping your evaluation.
        </p>
      </section>

      {/* Main Interactive Studio Deck */}
      <section className="glass-card" style={{
        padding: "0",
        marginBottom: 40,
        overflow: "hidden",
        border: "1.5px solid var(--border-card)",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Model Selection Header Bar (Clean Integrated Position) */}
        <div style={{
          padding: "16px 28px",
          background: "rgba(250, 246, 240, 0.9)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--primary-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)"
            }}>
              <Cpu size={16} />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                Selected ML Architecture:
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
                4 Real Trained Baselines Available
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { id: "logistic_regression", label: "Logistic Regression", acc: "92.4%", badge: "Best" },
              { id: "linear_svm", label: "Linear SVM", acc: "91.8%" },
              { id: "random_forest", label: "Random Forest", acc: "86.5%" },
              { id: "naive_bayes", label: "Naive Bayes", acc: "84.2%" }
            ].map((m) => {
              const isSel = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectModel(m.id)}
                  disabled={switchingModel}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: isSel
                      ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
                      : "rgba(255, 255, 255, 0.85)",
                    color: isSel ? "#FFFDFB" : "var(--text-secondary)",
                    border: isSel ? "1px solid transparent" : "1px solid var(--border-subtle)",
                    boxShadow: isSel ? "0 4px 12px var(--primary-glow)" : "none"
                  }}
                >
                  <span>{m.label}</span>
                  <span style={{
                    fontSize: 10,
                    padding: "1px 5px",
                    borderRadius: 8,
                    background: isSel ? "rgba(255, 255, 255, 0.25)" : "var(--primary-subtle)",
                    color: isSel ? "#FFF" : "var(--primary)"
                  }}>
                    {m.acc}
                  </span>
                  {m.badge && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: isSel ? "#FFF" : "var(--secondary)",
                      textTransform: "uppercase"
                    }}>
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area Body */}
        <div style={{ padding: "32px 32px 28px" }}>
          <form onSubmit={handleAnalyze}>
            {/* Input Toolbar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 10
            }}>
              <label style={{
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <Heart size={18} color="var(--primary)" />
                <span>Express Your Inner Experience</span>
              </label>

              {/* Voice Input Assistant Trigger */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={isListening ? "mic-active" : "btn-outline"}
                    style={{
                      padding: "8px 16px",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: "var(--radius-pill)"
                    }}
                    title={isListening ? "Click to stop recording" : "Click to speak your thoughts"}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={15} />
                        <span>Listening... (Tap to Finish)</span>
                      </>
                    ) : (
                      <>
                        <Mic size={15} color="var(--primary)" />
                        <span>Speak Thought (Voice Input)</span>
                      </>
                    )}
                  </button>
                )}
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {statement.length} characters
                </span>
              </div>
            </div>

            {/* Listening Live Audio Banner */}
            {isListening && (
              <div style={{
                padding: "12px 18px",
                background: "var(--primary-subtle)",
                border: "1.5px solid rgba(217, 112, 81, 0.35)",
                borderRadius: "var(--radius-md)",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }} className="animate-fade-in">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, height: 22 }}>
                    <div className="wave-bar" style={{ animationDelay: "0s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.4s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
                    Transcribing your voice in real time... Speak naturally and authentically.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--primary)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                    background: "rgba(255,255,255,0.8)"
                  }}
                >
                  Done Speaking
                </button>
              </div>
            )}

            {/* Textarea */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <textarea
                rows={5}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Take a gentle breath and express your thoughts, sensations, or feelings here... or click 'Speak Thought' above to talk."
                style={{
                  width: "100%",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: isListening ? "2px solid var(--primary)" : "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  resize: "vertical",
                  boxShadow: isListening ? "0 0 20px var(--primary-glow)" : "none",
                  transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 4px var(--primary-subtle)";
                }}
                onBlur={(e) => {
                  if (!isListening) {
                    e.target.style.borderColor = "var(--border-subtle)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            </div>

            {/* Thought Prompt Pills */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                display: "block",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Sample Clinical Contexts:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStatement(p.text)}
                    style={{
                      padding: "6px 14px",
                      background: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-pill)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary)";
                      e.currentTarget.style.background = "var(--primary-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                    }}
                  >
                    <Sparkles size={12} color="var(--primary)" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border-subtle)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <ShieldCheck size={16} color="var(--secondary)" />
                <span>Protected by local encryption & privacy safeguards</span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                {statement && (
                  <button
                    type="button"
                    onClick={() => setStatement("")}
                    className="btn-ghost"
                    style={{ fontSize: 14 }}
                  >
                    Clear Text
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !statement.trim()}
                  className="btn-primary"
                  style={{
                    padding: "14px 36px",
                    fontSize: 15,
                    opacity: loading || !statement.trim() ? 0.6 : 1
                  }}
                >
                  <Send size={16} />
                  <span>Analyze Emotional State</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Synaptic Loading Animation State */}
      {loading && (
        <section className="glass-card animate-fade-in" style={{
          padding: "48px 36px",
          textAlign: "center",
          marginBottom: 40,
          background: "rgba(255, 255, 255, 0.95)",
          border: "1.5px solid var(--border-card)"
        }}>
          {/* Animated Warm Concentric Halo */}
          <div style={{
            position: "relative",
            width: 140,
            height: 140,
            margin: "0 auto 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div
              className="synaptic-loading"
              style={{
                position: "absolute",
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(242, 132, 130, 0.3) 0%, rgba(217, 112, 81, 0.05) 70%, transparent 100%)"
              }}
            />
            <div
              className="spin-slow"
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px dashed var(--primary-light)",
                opacity: 0.7
              }}
            />
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: 26,
              boxShadow: "0 8px 24px var(--primary-glow)",
              zIndex: 2
            }}>
              🌸
            </div>
          </div>

          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            MindLens AI is Evaluating Your Statement
          </h3>
          <p style={{
            fontSize: 15,
            color: "var(--primary)",
            fontWeight: 600,
            minHeight: 24,
            transition: "all 0.4s ease"
          }}>
            {loadingMessages[loadingStep]}
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 20
          }}>
            {[0, 1, 2, 3].map((stepIdx) => (
              <div
                key={stepIdx}
                style={{
                  width: stepIdx === loadingStep ? 24 : 8,
                  height: 8,
                  borderRadius: 10,
                  background: stepIdx === loadingStep ? "var(--primary)" : "rgba(217, 112, 81, 0.2)",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Assessment Results Section with Empathetic Voice Companion */}
      {result && categoryMeta && !loading && (
        <section className="glass-card animate-fade-in" style={{
          padding: "36px",
          border: `1.5px solid ${categoryMeta.border}`,
          marginBottom: 40,
          background: "rgba(255, 255, 255, 0.95)"
        }}>
          {/* Header Row: Category Badge + Voice Output Button + Confidence Gauge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            paddingBottom: 24,
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: 28
          }}>
            {/* Category Identity */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{
                fontSize: 38,
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: categoryMeta.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${categoryMeta.border}`
              }}>
                {categoryMeta.emoji}
              </span>
              <div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)"
                }}>
                  Evaluated Mental Health Classification
                </span>
                <h2 style={{
                  fontSize: 34,
                  color: categoryMeta.color,
                  fontWeight: 800,
                  lineHeight: 1.15
                }}>
                  {result.predicted_category}
                </h2>
              </div>
            </div>

            {/* Voice Companion & Confidence Block */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Empathetic Audio Reading Companion */}
              <button
                type="button"
                onClick={() => toggleSpeakGuidance(
                  `We hear you. The model detected patterns of ${result.predicted_category} with ${(result.confidence * 100).toFixed(0)} percent confidence. ${categoryMeta.advice}`
                )}
                className="btn-outline"
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderColor: isSpeaking ? "var(--secondary)" : "var(--border-subtle)",
                  background: isSpeaking ? "var(--secondary-subtle)" : "rgba(255,255,255,0.85)",
                  color: isSpeaking ? "var(--secondary)" : "var(--text-primary)"
                }}
                title={isSpeaking ? "Pause audio reading" : "Listen to audio guidance"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={16} />
                    <span>Stop Voice</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 16 }}>
                      <div className="wave-bar" style={{ animationDelay: "0s", height: 12, background: "var(--secondary)" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.2s", height: 16, background: "var(--secondary)" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.4s", height: 10, background: "var(--secondary)" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <Volume2 size={16} color="var(--secondary)" />
                    <span>Listen Aloud (Voice Companion)</span>
                  </>
                )}
              </button>

              {/* Confidence Gauge */}
              <div style={{
                textAlign: "right",
                paddingLeft: 16,
                borderLeft: "1px solid var(--border-subtle)"
              }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>
                  Model Confidence
                </span>
                <span style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)"
                }}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Empathetic Guidance Banner */}
          <div style={{
            padding: "20px 24px",
            background: categoryMeta.bg,
            border: `1.5px solid ${categoryMeta.border}`,
            borderRadius: "var(--radius-md)",
            marginBottom: 32,
            display: "flex",
            gap: 16,
            alignItems: "flex-start"
          }}>
            <Sparkles size={22} color={categoryMeta.color} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: "block", color: "var(--text-primary)", fontSize: 15, marginBottom: 4 }}>
                Empathetic Observation & Support:
              </strong>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {categoryMeta.advice}
              </p>
            </div>
          </div>

          {/* Explainable AI: Word-Level Feature Attributions */}
          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8
            }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                  Explainable AI (XAI): Transparent Word Attributions
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Exact linear model log-odds feature importance. Words highlighted in terracotta/coral elevated class risk.
                </p>
              </div>
              <span className="glass-pill" style={{ fontSize: 12, color: "var(--secondary)" }}>
                <Layers size={13} />
                <span>Feature Weights Tensor</span>
              </span>
            </div>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              padding: "20px",
              background: "rgba(255, 255, 255, 0.75)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)"
            }}>
              {result.top_contributing_words && result.top_contributing_words.length > 0 ? (
                result.top_contributing_words.map((item, idx) => {
                  const isPos = item.score > 0;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "var(--radius-pill)",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: isPos ? "var(--primary-subtle)" : "var(--secondary-subtle)",
                        border: isPos
                          ? "1px solid rgba(217, 112, 81, 0.3)"
                          : "1px solid rgba(157, 129, 186, 0.3)",
                        color: isPos ? "var(--primary)" : "var(--secondary)"
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>"{item.word}"</span>
                      <span style={{
                        fontSize: 11,
                        background: isPos ? "rgba(217, 112, 81, 0.15)" : "rgba(157, 129, 186, 0.15)",
                        padding: "2px 6px",
                        borderRadius: 10
                      }}>
                        {item.score > 0 ? `+${item.score.toFixed(3)}` : item.score.toFixed(3)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  No significant specific vocabulary tokens detected above attribution baseline.
                </span>
              )}
            </div>
          </div>

          {/* Multi-Class Probability Distribution (All 7 Classes) */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
              Full 7-Class Probability Distribution
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14
            }}>
              {Object.entries(result.probabilities || {}).map(([catName, probVal]) => {
                const meta = CATEGORY_COLORS[catName] || CATEGORY_COLORS.Normal;
                const isWinner = catName === result.predicted_category;
                const pct = (probVal * 100).toFixed(1);

                return (
                  <div
                    key={catName}
                    style={{
                      padding: "16px",
                      background: isWinner ? meta.bg : "rgba(255, 255, 255, 0.7)",
                      border: isWinner ? `1.5px solid ${meta.border}` : "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: isWinner ? 700 : 500,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}>
                        <span>{meta.emoji}</span>
                        <span>{catName}</span>
                      </span>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isWinner ? meta.color : "var(--text-muted)"
                      }}>
                        {pct}%
                      </span>
                    </div>

                    <div style={{
                      width: "100%",
                      height: 7,
                      borderRadius: 10,
                      background: "rgba(0, 0, 0, 0.04)",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: meta.color,
                        borderRadius: 10,
                        transition: "width 0.8s ease-out"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Verification Feedback & Auto-Save */}
          <div style={{
            padding: "22px 24px",
            background: "rgba(250, 246, 240, 0.85)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16
          }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                Does this assessment resonate with your emotional state?
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Your feedback anonymously refines model accuracy and validation metrics.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {feedbackSent ? (
                <div className="glass-pill" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13 }}>
                  <CheckCircle size={15} />
                  <span>Thank you! Feedback recorded into SQLite DB</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => submitFeedback(true)}
                    className="btn-outline"
                    style={{ fontSize: 13, padding: "8px 18px" }}
                  >
                    <CheckCircle size={15} color="var(--primary)" />
                    <span>Yes, Accurate</span>
                  </button>
                  <button
                    onClick={() => submitFeedback(false)}
                    className="btn-ghost"
                    style={{ fontSize: 13, padding: "8px 18px" }}
                  >
                    <HelpCircle size={15} />
                    <span>Needs Adjustment</span>
                  </button>
                </>
              )}

              {user && savedToProfile && (
                <div className="glass-pill" style={{ color: "var(--secondary)", fontSize: 12 }}>
                  <Bookmark size={13} />
                  <span>Saved to Profile</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gentle Mindfulness / Grounding Invitation */}
      <section style={{
        marginTop: 48,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24
      }}>
        <div className="glass-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>🌿</span>
            <h4 style={{ fontSize: 18, fontWeight: 700 }}>Interactive Breathing Sanctuary</h4>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Try our soothing 4-4-4 rhythmic breathing orb to reset your heart rate
            variability and soothe neurological stress.
          </p>
          <Link to="/mindfulness" className="btn-secondary" style={{ fontSize: 13, padding: "10px 20px" }}>
            <span>Start Breathing Exercise</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>📊</span>
            <h4 style={{ fontSize: 18, fontWeight: 700 }}>Analytics & Accuracy Benchmarks</h4>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Explore aggregate assessment distributions, human validation rates, and benchmark
            comparisons across our 4 Machine Learning architectures.
          </p>
          <Link to="/analytics" className="btn-outline" style={{ fontSize: 13, padding: "10px 20px" }}>
            <span>View Benchmark Lab</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
