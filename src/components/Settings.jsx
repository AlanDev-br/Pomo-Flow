import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { saveDefaultSettings } from "../services/studyTime";

export function Settings({ times, onSave, onClose }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState(times);
  const [saved, setSaved] = useState(false);

  // Atualiza o rascunho quando o usuário digita
  const handleChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // Valida os valores entre 1 e 99 minutos
  const validate = () => ({
    pomodoro: Math.max(1, Math.min(99, draft.pomodoro)),
    shortBreak: Math.max(1, Math.min(99, draft.shortBreak)),
    longBreak: Math.max(1, Math.min(99, draft.longBreak)),
  });

  // Salva apenas para a sessão atual
  const handleSave = () => {
    onSave(validate());
  };

  // Salva no Firestore como configuração padrão do usuário
  const handleSaveDefault = async () => {
    const validated = validate();
    await saveDefaultSettings(user.uid, validated);
    onSave(validated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-lg font-bold tracking-wide">Settings</h2>

        {/* Campos de tempo para cada aba */}
        {[
          { key: "pomodoro", label: "Pomodoro" },
          { key: "shortBreak", label: "Short Break" },
          { key: "longBreak", label: "Long Break" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={99}
                value={draft[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="bg-[#2a2a2a] text-white text-center rounded-lg w-16 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-gray-600 text-xs">min</span>
            </div>
          </div>
        ))}

        {/* Botões de ação principais */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-gray-400 bg-[#2a2a2a] hover:bg-[#333] transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition text-sm font-semibold"
          >
            Save
          </button>
        </div>

        {/* Botão para salvar como configuração padrão no Firestore */}
        <button
          onClick={handleSaveDefault}
          className="w-full py-2 rounded-xl text-sm transition border border-[#333] text-gray-400 hover:border-red-500 hover:text-red-400"
        >
          {saved ? "✓ Saved as default!" : "Save as Default"}
        </button>
      </div>
    </div>
  );
}
