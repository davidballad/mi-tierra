/**
 * Authentication modal — Google sign-in and email/password with
 * login/register toggle. All copy in Spanish.
 */

"use client";

import { useState, type FormEvent } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import { Button } from "@/components/ui/button";
import { Leaf, X } from "lucide-react";

type Mode = "login" | "register";

const FIELD =
  "w-full border border-sand-dark rounded-lg px-3 py-2 text-sm bg-white " +
  "focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30";

function parseError(e: unknown): string {
  const code = (e as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "Correo electrónico inválido.",
    "auth/popup-closed-by-user": "Inicio de sesión cancelado.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  };
  return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
}

export default function AuthModal() {
  const { handleAuthSuccess, closeModal } = useAuthFlow();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<{ user: Parameters<typeof handleAuthSuccess>[0] }>) => {
    if (!auth) { setError("Firebase no está configurado. Añade tus credenciales en .env.local."); return; }
    setBusy(true);
    setError(null);
    try {
      const { user } = await fn();
      await handleAuthSuccess(user);
    } catch (e) {
      setError(parseError(e));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = () => run(() => signInWithPopup(auth!, new GoogleAuthProvider()));

  const onEmail = (e: FormEvent) => {
    e.preventDefault();
    run(() =>
      mode === "login"
        ? signInWithEmailAndPassword(auth!, email, password)
        : createUserWithEmailAndPassword(auth!, email, password),
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center gap-2 font-heading text-xl font-bold text-terracotta">
          <Leaf className="h-5 w-5" />
          Mi Tierra
        </span>
        <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
      </div>

      <h2 className="font-heading text-2xl font-bold text-forest">
        {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
      </h2>
      <p className="text-muted-foreground text-sm mt-1 mb-6">
        {mode === "login" ? "Inicia sesión para continuar" : "Únete a la comunidad artesanal"}
      </p>

      {/* Google */}
      <button
        onClick={onGoogle}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 border border-sand-dark rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-sand/40 transition-colors disabled:opacity-60"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </button>

      <div className="relative flex items-center my-4">
        <div className="flex-1 border-t border-sand-dark" />
        <span className="px-3 text-xs text-muted-foreground">o</span>
        <div className="flex-1 border-t border-sand-dark" />
      </div>

      {/* Email form */}
      <form onSubmit={onEmail} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required placeholder="tu@correo.com" className={FIELD} />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••" minLength={6} className={FIELD} />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <Button type="submit" disabled={busy} className="w-full bg-terracotta text-white hover:bg-terracotta-light">
          {busy ? "Cargando..." : mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
          className="text-terracotta font-medium hover:underline"
        >
          {mode === "login" ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
