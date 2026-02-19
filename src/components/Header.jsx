import { useAuth } from "../contexts/AuthContext";

export function Header({ activePage, onPageChange }) {
  const { user, logout } = useAuth();
  const pages = ["Home", "Statistics", "Settings"];

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-6 text-white">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)} // avisa o Home qual página foi clicada
            className={`px-4 py-2 rounded-xl transition ${
              activePage === page
                ? "bg-red-500" // Ativo: Fundo vermelho
                : "hover:text-red-400" // Inativo: só o hover
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      {/* Avatar + Nome + Logout */}
      <div className="flex items-center gap-3">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="text-white text-sm">
          {user?.displayName ?? user?.email}
        </span>
        <button
          onClick={logout}
          className="text-xs text-gray-500 hover:text-red-400 transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
