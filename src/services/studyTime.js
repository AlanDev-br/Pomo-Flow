const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function loadTodayTime(userId) {
  const res = await fetch(`${API_URL}/api/study-time/${userId}`);
  const data = await res.json();
  return data.seconds ?? 0;
}

export async function saveTodayTime(userId, seconds) {
  await fetch(`${API_URL}/api/study-time/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seconds }),
  });
}

export async function resetTodayTime(userId) {
  const res = await fetch(`${API_URL}/api/study-time/${userId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data.seconds;
}

export async function deduceTodayTime(userId, minutes) {
  const res = await fetch(`${API_URL}/api/study-time/${userId}/deduce`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutes }),
  });
  const data = await res.json();
  return data.seconds;
}

export async function saveDefaultSettings(userId, times) {
  await fetch(`${API_URL}/api/settings/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(times),
  });
}

export async function loadDefaultSettings(userId) {
  const res = await fetch(`${API_URL}/api/settings/${userId}`);
  const data = await res.json();
  return data.times ?? null;
}

export async function loadTotalTime(userId) {
  const res = await fetch(`${API_URL}/api/study-time/${userId}/total`);
  const data = await res.json();
  return data.seconds ?? 0;
}

export async function loadWeekData(userId) {
  const res = await fetch(`${API_URL}/api/study-time/${userId}/week`);
  const data = await res.json();
  return data.days ?? [];
}
