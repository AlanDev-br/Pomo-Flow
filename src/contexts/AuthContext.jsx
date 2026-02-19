import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = ainda carregando

  useEffect(() => {
    // Firebase avisa automaticamente quando o login muda
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null); // null = não logado
    });
    return unsubscribe; // limpa o listener ao desmontar
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}
