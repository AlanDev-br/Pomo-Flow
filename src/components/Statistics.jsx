import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { loadWeekData } from "../services/studyTime";
import { useAuth } from "../contexts/AuthContext";

export function Statistics() {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user) {
      loadWeekData(user.uid).then(setData);
    }
  }, [user]);

  const today = new Date()
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="bg-[#141414] rounded-2xl p-6 flex flex-col gap-4 h-full">
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
          Statistics
        </p>
        <h2 className="text-white text-xl font-bold">Esta semana</h2>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit="m"
            />
            <Tooltip
              cursor={{ fill: "#2a2a2a" }}
              contentStyle={{
                background: "#1a1a1a",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value} min`, "Foco"]}
            />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.day}
                  fill={entry.day === today ? "#ef4444" : "#2a2a2a"} // ← hoje em vermelho
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total da semana */}
      <div className="border-t border-[#2a2a2a] pt-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
          Total da semana
        </p>
        <p className="text-white text-2xl font-bold">
          {Math.floor(data.reduce((acc, d) => acc + d.minutes, 0) / 60)}h{" "}
          {data.reduce((acc, d) => acc + d.minutes, 0) % 60}m
        </p>
      </div>
    </div>
  );
}
