import { useState, useEffect, useRef } from "react";
import bellSound from "../assets/Transition-Bell.mp3";

export function Timer({ activeTab, onTabChange, times, onPomodoroTick }) {
  const TABS = [
    { key: "pomodoro", label: "Pomodoro", minutes: times.pomodoro },
    { key: "shortBreak", label: "Short Break", minutes: times.shortBreak },
    { key: "longBreak", label: "Long Break", minutes: times.longBreak },
  ];

  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  const totalTime = currentTab.minutes * 60;

  const [time, setTime] = useState(totalTime); // tempo restante em segundos
  const [isRunning, setIsRunning] = useState(false); // se o timer está rodando
  const autoStart = useRef(false); // controla início automático entre abas
  const bell = useRef(new Audio(bellSound)); // som de transição

  // Reseta o timer quando a aba muda
  useEffect(() => {
    setIsRunning(false);
    setTime(currentTab.minutes * 60);
    if (autoStart.current) {
      setIsRunning(true);
      autoStart.current = false;
    }
  }, [activeTab]);

  // Intervalo principal — decrementa o tempo e dispara o tick no Pomodoro
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1); // time é usado aqui

        if (activeTab === "pomodoro") {
          onPomodoroTick?.(); // isRunning garante que só roda quando ativo
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, activeTab]); // isRunning e time são dependências do intervalo

  // Reage quando o tempo zera — troca de aba e toca o som
  useEffect(() => {
    if (time === 0) {
      bell.current.play();
      autoStart.current = true;
      if (activeTab === "pomodoro") {
        onTabChange("shortBreak");
      } else if (activeTab === "shortBreak") {
        onTabChange("pomodoro");
      }
      setIsRunning(false);
    }
  }, [time]);

  useEffect(() => {
    setIsRunning(false);
    setTime(currentTab.minutes * 60);
  }, [times]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const radius = 110;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = totalTime > 0 ? time / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="bg-[#141414] rounded-2xl p-6 flex flex-col items-center justify-center">
      <div className="flex gap-2 bg-[#1f1f1f] rounded-xl p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-red-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#2a2a2a"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#ef4444"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: "stroke-dashoffset 1s linear" }}
            transform={`rotate(-90 ${radius} ${radius}) scale(1, -1) translate(0, -${radius * 2})`}
          />
        </svg>
        <span className="absolute text-4xl font-bold text-white">
          {formattedTime}
        </span>
      </div>

      <button
        onClick={() => setIsRunning(!isRunning)}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition"
      >
        {isRunning ? "Pause" : "Start Session"}
      </button>
    </div>
  );
}
