import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  getUserProfile,
  loginUser,
  registerUser,
  loginAsGuest,
  logoutUser,
  saveUserProfile,
  saveAssessmentToProfile,
  getUserAssessments,
  saveReflection,
  getUserReflections,
  isFirebaseConfigured
} from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load auth state and profile on mount
  const loadUserData = async () => {
    try {
      const current = getCurrentUser();
      setUser(current);
      if (current && current.uid) {
        const profile = await getUserProfile(current.uid);
        setUserProfile(profile);
        setAssessments(getUserAssessments(current.uid));
        setReflections(getUserReflections(current.uid));
      } else {
        setUserProfile(null);
        setAssessments([]);
        setReflections([]);
      }
    } catch (err) {
      console.error("Auth context error loading user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleAuthChange = () => {
      loadUserData();
    };

    const handleProfileChange = async () => {
      const current = getCurrentUser();
      if (current && current.uid) {
        const p = await getUserProfile(current.uid);
        setUserProfile(p);
        setAssessments(getUserAssessments(current.uid));
        setReflections(getUserReflections(current.uid));
      }
    };

    window.addEventListener("mindlens_auth_changed", handleAuthChange);
    window.addEventListener("mindlens_profile_updated", handleProfileChange);

    return () => {
      window.removeEventListener("mindlens_auth_changed", handleAuthChange);
      window.removeEventListener("mindlens_profile_updated", handleProfileChange);
    };
  }, []);

  const login = async (email, password) => {
    const loggedIn = await loginUser(email, password);
    setUser(loggedIn);
    const profile = await getUserProfile(loggedIn.uid);
    setUserProfile(profile);
    setAssessments(getUserAssessments(loggedIn.uid));
    setReflections(getUserReflections(loggedIn.uid));
    return loggedIn;
  };

  const register = async (email, password, displayName) => {
    const registered = await registerUser(email, password, displayName);
    setUser(registered);
    const profile = await getUserProfile(registered.uid);
    setUserProfile(profile);
    return registered;
  };

  const guestLogin = async () => {
    const guest = await loginAsGuest();
    setUser(guest);
    const profile = await getUserProfile(guest.uid);
    setUserProfile(profile);
    setAssessments(getUserAssessments(guest.uid));
    setReflections(getUserReflections(guest.uid));
    return guest;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
    setAssessments([]);
    setReflections([]);
  };

  const updateProfileData = async (data) => {
    if (!user || !user.uid) throw new Error("Must be logged in to update profile");
    await saveUserProfile(user.uid, data);
    const updated = await getUserProfile(user.uid);
    setUserProfile(updated);
    return updated;
  };

  const recordAssessment = async (assessment) => {
    if (!user || !user.uid) return null;
    const res = await saveAssessmentToProfile(user.uid, assessment);
    setAssessments(getUserAssessments(user.uid));
    const p = await getUserProfile(user.uid);
    setUserProfile(p);
    return res;
  };

  const recordReflection = async (text, mood) => {
    if (!user || !user.uid) return null;
    const res = await saveReflection(user.uid, text, mood);
    setReflections(getUserReflections(user.uid));
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        assessments,
        reflections,
        loading,
        isFirebaseConfigured,
        login,
        register,
        guestLogin,
        logout,
        updateProfileData,
        recordAssessment,
        recordReflection,
        refreshProfile: loadUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
