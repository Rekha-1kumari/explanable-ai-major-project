/**
 * Firebase Authentication & Firestore Database Integration
 *
 * Supports both real Firebase project configuration (via .env)
 * and an integrated resilient Local Firebase Provider so authentication,
 * profile storage, wellness metrics, and history work reliably out of the box.
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword as fbSignIn,
  createUserWithEmailAndPassword as fbCreateUser,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile as fbUpdateProfile,
  signInAnonymously as fbSignInAnonymously
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

// Firebase environment configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 10 &&
  firebaseConfig.projectId
);

let app = null;
let authInstance = null;
let firestoreInstance = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(app);
    firestoreInstance = getFirestore(app);
    console.info("Connected to live Firebase instance.");
  } catch (err) {
    console.warn("Firebase initialization failed, falling back to local provider:", err);
  }
}

// ============================================================================
// SIMULATED / LOCAL FIREBASE AUTH & FIRESTORE PROVIDER
// ============================================================================

const STORAGE_USERS_KEY = "mindlens_firebase_users_v1";
const STORAGE_CURRENT_USER_KEY = "mindlens_firebase_auth_state_v1";
const STORAGE_PROFILES_KEY = "mindlens_firestore_profiles_v1";
const STORAGE_ASSESSMENTS_KEY = "mindlens_firestore_assessments_v1";
const STORAGE_REFLECTIONS_KEY = "mindlens_firestore_reflections_v1";

const DEFAULT_AVATARS = [
  "🌸", "🌿", "🕊️", "☀️", "🦋", "✨", "🌺", "🍵", "🍃"
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function getStoredProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredProfiles(profiles) {
  localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
}

// Initial seed profile for instant guest preview if none exists
(function initSeedProfiles() {
  const profiles = getStoredProfiles();
  if (!profiles["guest_mindlens_user"]) {
    profiles["guest_mindlens_user"] = {
      uid: "guest_mindlens_user",
      email: "guest@mindlens.sanctuary",
      displayName: "Gentle Traveler",
      avatar: "🌸",
      bio: "Exploring inner peace, emotional balance, and mindful living.",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      dailyMoodRating: 4,
      wellnessGoals: [
        "Daily 5-minute deep breathing",
        "Acknowledge stressful thoughts without judgment",
        "Prioritize consistent 8-hour sleep cycles"
      ],
      stressTriggers: [
        "Unrealistic work deadlines",
        "Crowded sensory overload",
        "Neglecting hydration and rest"
      ],
      emergencyContact: {
        name: "Dr. Ananya Ray",
        relationship: "Mental Health Counselor",
        phone: "+91 9999 666 555"
      },
      stats: {
        totalAssessments: 3,
        calmStreakDays: 5,
        avgConfidence: 89.4
      }
    };
    saveStoredProfiles(profiles);
  }
})();

// ============================================================================
// UNIFIED AUTH METHODS
// ============================================================================

export async function loginUser(email, password) {
  if (isFirebaseConfigured && authInstance) {
    const userCredential = await fbSignIn(authInstance, email, password);
    return userCredential.user;
  }

  // Local Provider
  await new Promise((r) => setTimeout(r, 250));
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!existing || existing.password !== password) {
    throw new Error("Invalid email or password. Please verify your credentials.");
  }

  const currentUser = {
    uid: existing.uid,
    email: existing.email,
    displayName: existing.displayName,
    avatar: existing.avatar
  };
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
  window.dispatchEvent(new Event("mindlens_auth_changed"));
  return currentUser;
}

export async function registerUser(email, password, displayName = "") {
  if (isFirebaseConfigured && authInstance) {
    const userCredential = await fbCreateUser(authInstance, email, password);
    if (displayName) {
      await fbUpdateProfile(userCredential.user, { displayName });
    }
    // Create initial firestore profile
    await saveUserProfile(userCredential.user.uid, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName || email.split("@")[0],
      avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      bio: "Embarking on a mindful self-discovery journey.",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      wellnessGoals: ["Practice mindful awareness", "Track emotional patterns"],
      stressTriggers: ["Work pressure"],
      emergencyContact: { name: "", relationship: "", phone: "" },
      stats: { totalAssessments: 0, calmStreakDays: 1, avgConfidence: 0 }
    });
    return userCredential.user;
  }

  // Local Provider
  await new Promise((r) => setTimeout(r, 300));
  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email address already exists.");
  }

  const uid = "usr_" + Math.random().toString(36).substring(2, 9) + Date.now();
  const avatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
  const newUser = {
    uid,
    email,
    password,
    displayName: displayName || email.split("@")[0],
    avatar
  };

  users.push(newUser);
  saveStoredUsers(users);

  // Initialize profile
  await saveUserProfile(uid, {
    uid,
    email,
    displayName: newUser.displayName,
    avatar,
    bio: "Embarking on a mindful self-discovery journey.",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    wellnessGoals: [
      "Practice mindful breathing every morning",
      "Notice emotional shifts with compassion",
      "Set healthy boundaries at work"
    ],
    stressTriggers: ["Long hours", "Lack of sleep"],
    emergencyContact: {
      name: "Trusted Companion",
      relationship: "Friend",
      phone: "+91 98765 43210"
    },
    stats: { totalAssessments: 0, calmStreakDays: 1, avgConfidence: 0 }
  });

  const currentUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    avatar: newUser.avatar
  };
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
  window.dispatchEvent(new Event("mindlens_auth_changed"));
  return currentUser;
}

export async function loginAsGuest() {
  const guestUser = {
    uid: "guest_mindlens_user",
    email: "guest@mindlens.sanctuary",
    displayName: "Gentle Traveler",
    avatar: "🌸",
    isGuest: true
  };
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(guestUser));
  window.dispatchEvent(new Event("mindlens_auth_changed"));
  return guestUser;
}

export async function logoutUser() {
  if (isFirebaseConfigured && authInstance) {
    await fbSignOut(authInstance);
  }
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  window.dispatchEvent(new Event("mindlens_auth_changed"));
}

export function getCurrentUser() {
  if (isFirebaseConfigured && authInstance && authInstance.currentUser) {
    return authInstance.currentUser;
  }
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ============================================================================
// FIRESTORE PROFILE & USER DATA METHODS
// ============================================================================

export async function getUserProfile(uid) {
  if (!uid) return null;

  if (isFirebaseConfigured && firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, "users", uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
    } catch (err) {
      console.warn("Firestore getUserProfile error, reading local fallback:", err);
    }
  }

  // Local fallback
  const profiles = getStoredProfiles();
  return profiles[uid] || null;
}

export async function saveUserProfile(uid, profileData) {
  if (!uid) return false;

  if (isFirebaseConfigured && firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, "users", uid);
      await setDoc(docRef, profileData, { merge: true });
    } catch (err) {
      console.warn("Firestore saveUserProfile error, caching local fallback:", err);
    }
  }

  // Always keep local copy synchronized
  const profiles = getStoredProfiles();
  profiles[uid] = { ...(profiles[uid] || {}), ...profileData, updatedAt: new Date().toISOString() };
  saveStoredProfiles(profiles);

  // Update current user state if name or avatar changed
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.uid === uid) {
    if (profileData.displayName) currentUser.displayName = profileData.displayName;
    if (profileData.avatar) currentUser.avatar = profileData.avatar;
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  window.dispatchEvent(new Event("mindlens_profile_updated"));
  return true;
}

// ============================================================================
// FIRESTORE ASSESSMENTS & REFLECTIONS
// ============================================================================

export async function saveAssessmentToProfile(uid, assessment) {
  if (!uid) return null;
  const item = {
    id: "asmt_" + Date.now(),
    uid,
    timestamp: new Date().toISOString(),
    ...assessment
  };

  try {
    const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(list));

    // Update user profile assessment stats
    const profile = await getUserProfile(uid);
    if (profile) {
      const currentStats = profile.stats || { totalAssessments: 0, calmStreakDays: 1, avgConfidence: 0 };
      const newTotal = (currentStats.totalAssessments || 0) + 1;
      const prevSum = (currentStats.avgConfidence || 0) * (currentStats.totalAssessments || 0);
      const newAvg = Number(((prevSum + (assessment.confidence * 100 || 80)) / newTotal).toFixed(1));
      
      await saveUserProfile(uid, {
        stats: {
          ...currentStats,
          totalAssessments: newTotal,
          avgConfidence: newAvg
        }
      });
    }
  } catch (err) {
    console.error("Failed to save assessment to profile:", err);
  }

  return item;
}

export function getUserAssessments(uid) {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((item) => item.uid === uid);
  } catch {
    return [];
  }
}

export async function saveReflection(uid, reflectionText, mood) {
  if (!uid || !reflectionText) return null;
  const entry = {
    id: "refl_" + Date.now(),
    uid,
    text: reflectionText,
    mood: mood || "Calm",
    timestamp: new Date().toISOString()
  };

  try {
    const raw = localStorage.getItem(STORAGE_REFLECTIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(STORAGE_REFLECTIONS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save reflection:", err);
  }

  return entry;
}

export function getUserReflections(uid) {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(STORAGE_REFLECTIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((item) => item.uid === uid);
  } catch {
    return [];
  }
}

export { DEFAULT_AVATARS };
