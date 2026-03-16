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
  resetTodayTime,
  deduceTodayTime,
} from "../services/studyTime";

export function Home({ onSignIn }) {
  const { user } = useAuth();

  // navegação
  const [activePage, setActivePage] = useState("Home");
  const [showSettings, setShowSettings] = useState(false);

  // timer
  const [activeTab, setActiveTab] = useState("pomodoro");
  const [times, setTimes] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // progresso do dia
  const [studySeconds, setStudySeconds] = useState(0);
  const saveTimer = useRef(null);

  // deduce
  const [showDeduce, setShowDeduce] = useState(false);
  const [deduceMinutes, setDeduceMinutes] = useState("");

  // confirmação de reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // carrega progresso e settings ao logar
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

  // salva com debounce pra não bater toda hora no Firestore
  useEffect(() => {
    if (!user || studySeconds === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTodayTime(user.uid, studySeconds).catch((err) =>
        console.error("Erro ao salvar tempo:", err),
      );
    }, 3000);
  }, [studySeconds]);

  const handlePomodoroTick = () => {
    setStudySeconds((prev) => prev + 1);
  };

  const handleReset = async () => {
    const seconds = await resetTodayTime(user.uid);
    setStudySeconds(seconds);
    setShowResetConfirm(false);
  };

  const handleDeduce = async () => {
    if (!user || !deduceMinutes) return;
    const seconds = await deduceTodayTime(user.uid, Number(deduceMinutes));
    setStudySeconds(seconds);
    setDeduceMinutes("");
    setShowDeduce(false);
  };

  // HH:MM:SS ou MM:SS dependendo do tempo
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

      <div className="relative z-10 flex items-center justify-center p-3 md:p-6">
        <div className="w-full max-w-7xl bg-[#1a1a1a] rounded-3xl shadow-2xl p-4 md:p-8">
          <Header
            activePage={activePage}
            onPageChange={(page) => {
              if (page === "Settings") setShowSettings(true);
              else setActivePage(page);
            }}
            onSignIn={onSignIn}
          />

          <div className="flex flex-col gap-8 mt-8 md:grid md:grid-cols-2">
            {/* left panel - timer fica rodando mesmo quando statistics aparece */}
            <div className="relative">
              <div className={activePage === "Statistics" ? "invisible" : ""}>
                <Timer
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  times={times}
                  onPomodoroTick={handlePomodoroTick}
                />
              </div>
              {activePage === "Statistics" && (
                <div className="absolute inset-0">
                  <Statistics />
                </div>
              )}
            </div>

            {/* right panel */}
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

              {/* reset e deduce só aparecem pra quem está logado */}
              {user && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowDeduce(!showDeduce)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    Deduce
                  </button>
                </div>
              )}

              {showDeduce && user && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    value={deduceMinutes}
                    onChange={(e) => setDeduceMinutes(e.target.value)}
                    placeholder="minutes"
                    className="bg-[#2a2a2a] text-white text-sm rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={handleDeduce}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeduce(false)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="border-t border-[#2a2a2a] pt-4">
                <Player />
              </div>
            </div>
          </div>

          {/* modal de settings */}
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

          {/* confirmação antes de resetar o progresso */}
          {showResetConfirm && (
            <div
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
              onClick={() => setShowResetConfirm(false)}
            >
              <div
                className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-white text-base font-semibold">
                  Are you sure you want to reset today's progress?
                </p>
                <p className="text-gray-500 text-sm">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl text-gray-400 bg-[#2a2a2a] hover:bg-[#333] transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition text-sm font-semibold"
                  >
                    Yes, reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
