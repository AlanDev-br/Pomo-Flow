import { Header } from "../components/Header";
import gradient from "../assets/Background.png";

export function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0d0d0d] overflow-hidden">
      {/* Background imagem */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl bg-[#1a1a1a] rounded-3xl shadow-2xl p-8">
          <Header />

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-[#141414] rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="w-64 h-64 rounded-full border-8 border-red-400 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">25:00</span>
              </div>

              <button className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition">
                Start Session
              </button>
            </div>

            <div className="bg-[#141414] rounded-2xl p-6 text-white">
              <h2 className="text-xl font-semibold">Right Panel</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
