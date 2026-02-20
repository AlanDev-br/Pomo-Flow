import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import gradient from "../assets/Background.png";
import { Timer } from "../components/Timer";
import { Settings } from "../components/Settings";
import { Statistics } from "../components/Statistics";
import { Player } from "../components/Player";
import { useAuth } from "../contexts/AuthContext";
import {
  loadTodayTime,
  saveTodayTime,
  loadDefaultSettings,
} from "../services/studyTime";

export function Home() {
  const { user } = useAuth();

  // Controle de navegação entre páginas do Header
  const [activePage, setActivePage] = useState("Home");

  // Controle da aba ativa no Timer
  const [activeTab, setActiveTab] = useState("pomodoro");

  // Ref para o debounce do salvamento no Firestore
  const saveTimer = useRef(null);

  // Tempos configuráveis de cada aba em minutos
  const [times, setTimes] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Controle de visibilidade do modal de Settings
  const [showSettings, setShowSettings] = useState(false);

  // Segundos acumulados de foco no dia atual
  const [studySeconds, setStudySeconds] = useState(0);

  // Carrega o progresso do dia e as configurações padrão ao entrar
  useEffect(() => {
    if (user) {
      loadTodayTime(user.uid)
        .then(setStudySeconds)
        .catch((err) => console.error("Erro ao carregar tempo:", err));

      loadDefaultSettings(user.uid)
        .then((defaultTimes) => {
          if (defaultTimes) setTimes(defaultTimes);
        })
        .catch((err) => console.error("Erro ao carregar settings:", err));
    }
  }, [user]);

  // Incrementa o contador a cada segundo que o Pomodoro está rodando
  const handlePomodoroTick = () => {
    setStudySeconds((prev) => prev + 1);
  };

  // Salva o progresso no Firestore com debounce de 3 segundos
  useEffect(() => {
    if (!user || studySeconds === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTodayTime(user.uid, studySeconds).catch((err) =>
        console.error("Erro ao salvar tempo:", err),
      );
    }, 3000);
  }, [studySeconds]);

  // Formata segundos em HH:MM:SS ou MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Retorna o nome do dia da semana atual em inglês
  const getDayName = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0d0d0d] overflow-hidden">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay escuro sobre o fundo */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo principal */}
      <div className="relative z-10 flex items-center justify-center p-3 md:p-6">
        <div className="w-full max-w-7xl bg-[#1a1a1a] rounded-3xl shadow-2xl p-4 md:p-8">
          {/* Header com navegação e perfil do usuário */}
          <Header
            activePage={activePage}
            onPageChange={(page) => {
              if (page === "Settings") setShowSettings(true);
              else setActivePage(page);
            }}
          />

          {/* Grid principal — coluna no mobile, 2 colunas no desktop */}
          <div className="flex flex-col gap-8 mt-8 md:grid md:grid-cols-2">
            {/* Left Panel — Timer e Statistics se alternam no mesmo espaço */}
            <div className="relative">
              {/* Timer fica invisível quando Statistics está ativo mas continua rodando */}
              <div className={activePage === "Statistics" ? "invisible" : ""}>
                <Timer
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  times={times}
                  onPomodoroTick={handlePomodoroTick}
                />
              </div>

              {/* Statistics sobrepõe o Timer quando ativo */}
              {activePage === "Statistics" && (
                <div className="absolute inset-0">
                  <Statistics />
                </div>
              )}
            </div>

            {/* Right Panel — Progresso do dia e Player de música */}
            <div className="bg-[#141414] rounded-2xl p-6 text-white flex flex-col gap-4">
              {/* Título com dia da semana dinâmico */}
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Your Progress this {getDayName()}
              </p>

              {/* Tempo acumulado de foco formatado */}
              <p className="text-3xl font-bold text-white tracking-widest">
                {formatTime(studySeconds)}
              </p>

              {/* Total em minutos */}
              <p className="text-gray-600 text-xs">
                {Math.floor(studySeconds / 60)} minutes of focus today
              </p>

              {/* Player de música */}
              <div className="border-t border-[#2a2a2a] pt-4">
                <Player />
              </div>
            </div>
          </div>

          {/* Modal de Settings */}
          {showSettings && (
            <Settings
              times={times}
              onSave={(newTimes) => {
                setTimes(newTimes);
                setShowSettings(false);
              }}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
