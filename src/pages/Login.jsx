import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

export function Login() {
  const [isCreating, setIsCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError("Erro ao entrar com Google.");
    }
  };

  const handleEmailAuth = async () => {
    setError("");
    try {
      if (isCreating) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
        {/* ← Nome e slogan do app */}
        <div className="text-center mb-2">
          <h1 className="text-red-500 text-3xl font-bold tracking-widest">
            PomoFlow
          </h1>
          <p className="text-gray-600 text-xs tracking-widest mt-1">
            Focus. Flow. Achieve.
          </p>
        </div>

        {/* ← Subtítulo dinâmico */}
        <p className="text-gray-400 text-sm text-center">
          {isCreating ? "Criar conta" : "Entrar"}
        </p>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        />

        <button
          onClick={handleEmailAuth}
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
        >
          {isCreating ? "Criar conta" : "Entrar"}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-gray-600 text-xs">ou</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <button
          onClick={handleGoogle}
          className="bg-[#2a2a2a] hover:bg-[#333] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Entrar com Google
        </button>

        <p
          onClick={() => setIsCreating(!isCreating)}
          className="text-gray-500 text-xs text-center cursor-pointer hover:text-gray-300 transition"
        >
          {isCreating ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
        </p>
      </div>
    </div>
  );
}
