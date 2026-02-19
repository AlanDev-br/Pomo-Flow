import { useAuth } from "../contexts/AuthContext";

export function Header({ activePage, onPageChange }) {
  const { user, logout } = useAuth();
  const pages = ["Home", "Statistics", "Settings"];

  return (
    // ← flex-col no mobile, flex-row no desktop
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* PomoFlow */}
      <span className="text-red-500 font-bold text-xl tracking-widest uppercase">
        PomoFlow
      </span>

      {/* Navegação */}
      <div className="flex gap-3 text-white flex-wrap">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-xl transition ${
              activePage === page ? "bg-red-500" : "hover:text-red-400"
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
