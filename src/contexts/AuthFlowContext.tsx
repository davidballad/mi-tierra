/**
 * Auth flow context — manages Firebase auth state and the multi-step
 * sign-in / role-selection / seller-onboarding modal sequence.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { FirestoreUser, UserRole } from "@/types";

export type ModalState = "auth" | "role" | "onboarding" | null;

export interface OnboardingData {
  shopName: string;
  bio: string;
  province: string;
}

interface AuthFlowContextType {
  user: User | null;
  firestoreUser: FirestoreUser | null;
  loading: boolean;
  modal: ModalState;
  openAuthModal: () => void;
  closeModal: () => void;
  handleAuthSuccess: (u: User) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthFlowContext = createContext<AuthFlowContextType | null>(null);

export function useAuthFlow(): AuthFlowContextType {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error("useAuthFlow must be used inside AuthFlowProvider");
  return ctx;
}

async function fetchUserDoc(uid: string): Promise<FirestoreUser | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    email: d.email as string,
    role: d.role as UserRole,
    province: d.province as string,
    createdAt: (d.createdAt?.toDate?.() as Date | undefined) ?? new Date(),
  };
}

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const existing = await fetchUserDoc(firebaseUser.uid);
        if (existing) {
          setFirestoreUser(existing);
          setModal((prev) => (prev === "auth" ? null : prev));
        } else {
          setModal("role");
        }
      } else {
        setFirestoreUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleAuthSuccess = async (u: User) => {
    const existing = await fetchUserDoc(u.uid);
    if (existing) {
      setFirestoreUser(existing);
      setModal(null);
    } else {
      setModal("role");
    }
  };

  const selectRole = async (role: UserRole) => {
    if (!user || !db) return;
    const payload = {
      uid: user.uid,
      email: user.email ?? "",
      role,
      province: "",
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", user.uid), payload);
    setFirestoreUser({ ...payload, createdAt: new Date() });
    setModal(role === "seller" ? "onboarding" : null);
  };

  const completeOnboarding = async ({ shopName, bio, province }: OnboardingData) => {
    if (!user || !db) return;
    const userPayload = {
      uid: user.uid,
      email: user.email ?? "",
      role: "seller" as UserRole,
      province,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", user.uid), userPayload);
    await setDoc(doc(db, "shops", `shop_${user.uid}`), {
      ownerId: user.uid,
      shopName,
      bio,
      rating: 0,
      createdAt: serverTimestamp(),
    });
    setFirestoreUser({ ...userPayload, createdAt: new Date() });
    setModal(null);
  };

  const signOut = async () => {
    if (!auth) return;
    await fbSignOut(auth);
    setUser(null);
    setFirestoreUser(null);
  };

  return (
    <AuthFlowContext.Provider
      value={{
        user,
        firestoreUser,
        loading,
        modal,
        openAuthModal: () => setModal("auth"),
        closeModal: () => setModal(null),
        handleAuthSuccess,
        selectRole,
        completeOnboarding,
        signOut,
      }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
}
