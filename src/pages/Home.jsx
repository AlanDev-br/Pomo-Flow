import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import gradient from "../assets/Background.png";
import { Timer } from "../components/Timer";
import { Settings } from "../components/Settings";
import { Statistics } from "../components/Statistics"; // ← import Statistics
import { loadTodayTime, saveTodayTime } from "../services/studyTime";
import { useAuth } from "../contexts/AuthContext";
import { Player } from "../components/Player";

export function Home() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("Home");
  const [activeTab, setActiveTab] = useState("pomodoro");
  const saveTimer = useRef(null);

  const [times, setTimes] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [studySeconds, setStudySeconds] = useState(0);

  useEffect(() => {
    if (user) {
      loadTodayTime(user.uid)
        .then((seconds) => {
          setStudySeconds(seconds);
        })
        .catch((err) => console.error("Erro ao carregar:", err));
    }
  }, [user]);

  const handlePomodoroTick = () => {
    setStudySeconds((prev) => prev + 1);
  };

  // ← Salva no Firestore 3 segundos após última atualização
  useEffect(() => {
    if (!user || studySeconds === 0) return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTodayTime(user.uid, studySeconds).catch((err) =>
        console.error("Erro ao salvar:", err),
      );
    }, 3000);
  }, [studySeconds]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

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
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl bg-[#1a1a1a] rounded-3xl shadow-2xl p-8">
          <Header
            activePage={activePage}
            onPageChange={(page) => {
              if (page === "Settings") setShowSettings(true);
              else setActivePage(page);
            }}
          />

          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* ← Left Panel — Timer e Statistics se alternam */}
            <div className="relative">
              {/* Timer — invisible mantém espaço e continua rodando */}
              <div className={activePage === "Statistics" ? "invisible" : ""}>
                <Timer
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  times={times}
                  onPomodoroTick={handlePomodoroTick}
                />
              </div>

              {/* Statistics — sobrepõe o Timer quando ativo */}
              {activePage === "Statistics" && (
                <div className="absolute inset-0">
                  <Statistics />
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="bg-[#141414] rounded-2xl p-6 text-white flex flex-col gap-4">
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Your Progress this {getDayName()}
              </p>
              <p className="text-3xl font-bold text-white tracking-widest">
                {formatTime(studySeconds)}
              </p>
              <p className="text-gray-600 text-xs">
                {Math.floor(studySeconds / 60)} minutes of focus today
              </p>
              <div className="border-t border-[#2a2a2a] pt-4">
                <Player />
              </div>
            </div>
          </div>

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
