import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

export default function App() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (user === undefined) return null;

  // Se clicou em Sign In mostra o Login
  if (showLogin && !user) {
    return <Login onBack={() => setShowLogin(false)} />;
  }

  // Sempre mostra o Home, passa o callback para abrir o Login
  return <Home onSignIn={() => setShowLogin(true)} />; // ← true não false
}
