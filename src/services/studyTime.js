import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

const today = () => new Date().toISOString().split("T")[0];

// Lê o tempo do dia atual
export async function loadTodayTime(userId) {
  const ref = doc(db, "studyTime", userId, "history", today());
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;
  return snap.data().seconds ?? 0;
}

// Salva em subcoleção history/{data} em vez de sobrescrever
export async function saveTodayTime(userId, seconds) {
  const ref = doc(db, "studyTime", userId, "history", today());
  await setDoc(ref, { date: today(), seconds });
}

// Busca os 7 dias da semana atual (Seg a Dom)
export async function loadWeekData(userId) {
  const ref = collection(db, "studyTime", userId, "history");
  const snap = await getDocs(ref);

  // Monta os 7 dias da semana atual
  const weekDays = getWeekDays();
  const data = snap.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().seconds ?? 0;
    return acc;
  }, {});

  return weekDays.map((day) => ({
    day: day.label, // "Seg", "Ter", etc
    minutes: Math.floor((data[day.date] ?? 0) / 60), // segundos → minutos
  }));
}

export async function loadTotalTime(userId) {
  const ref = collection(db, "studyTime", userId, "history");
  const snap = await getDocs(ref);

  const totalSeconds = snap.docs.reduce((acc, doc) => {
    return acc + (doc.data().seconds ?? 0);
  }, 0);

  return totalSeconds;
}

// Salva configurações padrão do usuário
export async function saveDefaultSettings(userId, times) {
  const ref = doc(db, "userSettings", userId);
  await setDoc(ref, { defaultTimes: times });
}

// Carrega configurações padrão do usuário
export async function loadDefaultSettings(userId) {
  const ref = doc(db, "userSettings", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().defaultTimes ?? null;
}

// Gera os 7 dias da semana atual (Seg a Dom)
function getWeekDays() {
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dom
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // volta para Seg

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      label: labels[date.getDay()],
    };
  });
}
