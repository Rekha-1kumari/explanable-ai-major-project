import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  User,
  Heart,
  Calendar,
  Sparkles,
  PhoneCall,
  Clock,
  Edit3,
  CheckCircle,
  Plus,
  Trash2,
  Bookmark,
  Shield,
  Smile,
  LogOut,
  LogIn
} from "lucide-react";
import { DEFAULT_AVATARS } from "../services/firebase";

export default function ProfilePage() {
  const { user, userProfile, assessments, reflections, logout, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || user?.avatar || "🌸");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [dailyMood, setDailyMood] = useState(userProfile?.dailyMoodRating || 4);
  const [emergencyName, setEmergencyName] = useState(userProfile?.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(userProfile?.emergencyContact?.phone || "");
  const [emergencyRel, setEmergencyRel] = useState(userProfile?.emergencyContact?.relationship || "");

  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState(userProfile?.wellnessGoals || [
    "Practice mindful breathing every morning",
    "Acknowledge stressful thoughts with kindness"
  ]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If not logged in, prompt sign in or guest login
  if (!user) {
    return (
      <div style={{ maxWidth: 700, margin: "80px auto", padding: "40px 24px", textAlign: "center" }} className="animate-fade-in">
        <div className="glass-card" style={{ padding: "48px 36px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Personal Wellness Profile</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
            Sign in with your Firebase account or continue as a guest to track your historical mental
            health assessments, personal journal reflections, and emergency support contacts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Link to="/auth" className="btn-primary" style={{ padding: "12px 28px" }}>
              <LogIn size={16} />
              <span>Sign In / Register</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData({
        displayName,
        avatar,
        bio,
        dailyMoodRating: dailyMood,
        wellnessGoals: goals,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRel
        }
      });
      setIsEditing(false);
      setSavedSuccess(true);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#D97051", "#F28482", "#B5838D"]
      });
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal.trim()]);
    setNewGoal("");
  };

  const removeGoal = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }} className="animate-fade-in">
      {/* Profile Banner */}
      <section className="glass-card" style={{
        padding: "36px",
        marginBottom: 36,
        background: "rgba(255, 255, 255, 0.92)",
        border: "1px solid rgba(217, 112, 81, 0.2)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary-subtle) 0%, var(--secondary-subtle) 100%)",
              border: "3px solid var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              boxShadow: "0 8px 24px var(--primary-glow)"
            }}>
              {userProfile?.avatar || user.avatar || "🌸"}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
                  {userProfile?.displayName || user.displayName || "Compassionate Soul"}
                </h1>
                {user.isGuest ? (
                  <span className="glass-pill" style={{ fontSize: 11, padding: "2px 10px", color: "var(--secondary)" }}>
                    Guest Profile
                  </span>
                ) : (
                  <span className="glass-pill" style={{ fontSize: 11, padding: "2px 10px", color: "var(--primary)" }}>
                    Firebase Verified
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>
                {user.email} • Sanctuary Member since {userProfile?.joinedDate || "Recently"}
              </p>
              {userProfile?.bio && (
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, fontStyle: "italic" }}>
                  "{userProfile.bio}"
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-outline"
              style={{ fontSize: 13, padding: "10px 20px" }}
            >
              <Edit3 size={15} />
              <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
            </button>
            <button
              onClick={logout}
              className="btn-ghost"
              style={{ fontSize: 13, padding: "10px 16px" }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "var(--primary-subtle)",
            border: "1px solid rgba(217, 112, 81, 0.3)",
            borderRadius: "var(--radius-md)",
            color: "var(--primary)",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <CheckCircle size={16} />
            <span>Profile and wellness preferences saved successfully to Firestore!</span>
          </div>
        )}
      </section>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <section className="glass-card animate-fade-in" style={{ padding: "32px", marginBottom: 36 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: "var(--text-primary)" }}>
            Edit Personal Profile & Sanctuary Settings
          </h3>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1.5px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Choose Sanctuary Avatar
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DEFAULT_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        fontSize: 20,
                        background: avatar === av ? "var(--primary-subtle)" : "rgba(255, 255, 255, 0.8)",
                        border: avatar === av ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                Personal Bio / Daily Affirmation
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A warm reminder or intention for yourself..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14
                }}
              />
            </div>

            {/* Emergency Contact Edit */}
            <div style={{
              padding: "20px",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              marginBottom: 24
            }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneCall size={16} color="var(--primary)" />
                <span>Emergency Crisis Contact</span>
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                <input
                  type="text"
                  placeholder="Contact Name (e.g., Mom, Dr. Sharma)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 13
                  }}
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g., Therapist, Partner)"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 13
                  }}
                />
                <input
                  type="text"
                  placeholder="Phone Number (+91 ...)"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 13
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-ghost"
                style={{ fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ padding: "10px 28px", fontSize: 14 }}
              >
                {saving ? "Saving to Firestore..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Grid: Goals & Emergency Contact */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, marginBottom: 40 }}>
        {/* Wellness Goals */}
        <section className="glass-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--primary)" />
              <span>My Wellness Intentions</span>
            </h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {goals.length} active goals
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {goals.map((goal, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 14
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--primary)" }}>🌸</span>
                  <span>{goal}</span>
                </div>
                {isEditing && (
                  <button onClick={() => removeGoal(idx)} style={{ color: "var(--text-muted)" }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="New goal (e.g., Evening journal)..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13
                }}
              />
              <button onClick={addGoal} className="btn-secondary" style={{ padding: "10px 16px", fontSize: 13 }}>
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          )}
        </section>

        {/* Emergency Crisis Contact */}
        <section className="glass-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)"
            }}>
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Trusted Emergency Contact</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Instant reach during acute episodes</span>
            </div>
          </div>

          {userProfile?.emergencyContact?.name ? (
            <div style={{
              padding: "18px",
              background: "var(--primary-subtle)",
              border: "1px solid rgba(217, 112, 81, 0.25)",
              borderRadius: "var(--radius-md)",
              marginBottom: 16
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", display: "block" }}>
                {userProfile.emergencyContact.name}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {userProfile.emergencyContact.relationship || "Trusted Companion"}
              </span>
              <div style={{ marginTop: 12 }}>
                <a
                  href={`tel:${userProfile.emergencyContact.phone}`}
                  className="btn-primary"
                  style={{ padding: "8px 20px", fontSize: 13, display: "inline-flex" }}
                >
                  <PhoneCall size={14} />
                  <span>Call {userProfile.emergencyContact.phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              padding: "18px",
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px dashed var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 16
            }}>
              No personal emergency contact added yet. Click "Edit Profile" above to designate a trusted contact.
            </div>
          )}

          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Free National Crisis Helpline (24/7): <strong>9999 666 555</strong> (Vandrevala Foundation) or <strong>14416</strong> (Tele-MANAS).
          </div>
        </section>
      </div>

      {/* Historical Assessment Logs from Firestore */}
      <section className="glass-card" style={{ padding: "36px", marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
              My Assessment History
            </h3>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Synchronized evaluations from your Firebase session
            </span>
          </div>
          <Link to="/" className="btn-outline" style={{ fontSize: 13, padding: "8px 18px" }}>
            <span>New Assessment</span>
          </Link>
        </div>

        {assessments && assessments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {assessments.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "18px 22px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 14
                }}
              >
                <div style={{ maxWidth: 680 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "3px 12px",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--primary-subtle)",
                      color: "var(--primary)"
                    }}>
                      {item.predicted_category || "Normal"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Confidence: {((item.confidence || 0.85) * 100).toFixed(1)}%
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      • {item.model_name ? item.model_name.replace("_", " ") : "Logistic Regression"}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.5 }}>
                    "{item.text || item.statement_text || "Assessment record"}"
                  </p>
                </div>

                <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-muted)" }}>
                  <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                  <span>{new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: "40px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border-subtle)"
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
              You haven't run any mental health evaluations yet.
            </p>
            <Link to="/" className="btn-primary" style={{ fontSize: 13 }}>
              <span>Take Your First Assessment</span>
            </Link>
          </div>
        )}
      </section>

      {/* Reflections Log from Firestore */}
      {reflections && reflections.length > 0 && (
        <section className="glass-card" style={{ padding: "36px" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: "var(--text-primary)" }}>
            Saved Mindful Reflections
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {reflections.map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: "20px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--secondary)" }}>
                    {r.mood || "Calm"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  "{r.text}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
