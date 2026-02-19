import { useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

export default function App() {
  const { user } = useAuth();

  // Ainda carregando o estado do Firebase
  if (user === undefined) return null;

  // Não logado → Login, Logado → Home
  return user ? <Home /> : <Login />;
}
