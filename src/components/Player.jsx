import { useState, useEffect, useRef } from "react";

const PLAYLISTS = [
  { id: "lofi", label: "Lo-fi", emoji: "🎵", videoId: "jfKfPfyJRdk" },
  { id: "jazz", label: "Jazz", emoji: "🎷", videoId: "neV3EPgvZ3g" },
  { id: "acoustic", label: "Acoustic", emoji: "🪕", videoId: "UlFyOsvmFxA" },
  { id: "nature", label: "Nature", emoji: "🌿", videoId: "q76bMs-NwRk" },
];

export function Player() {
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // instância do YT.Player
  const containerRef = useRef(null); // div onde o player é montado
  const readyRef = useRef(false); // se o player já está pronto
  const [playerKey, setPlayerKey] = useState(0);
  // Carrega o script da YouTube API uma vez
  useEffect(() => {
    if (window.YT) return; // já carregado

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Quando troca de playlist, cria um novo player
  useEffect(() => {
    if (!activePlaylist) return;

    readyRef.current = false;

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: activePlaylist.videoId, // ← vídeo direto
        playerVars: {
          autoplay: 1,
          mute: 1, // ← começa mutado para contornar bloqueio
          controls: 0,
          loop: 1,
          playlist: activePlaylist.videoId, // ← necessário para loop funcionar
        },
        events: {
          onReady: (e) => {
            readyRef.current = true;
            e.target.unMute(); // ← desmuta assim que pronto
            e.target.playVideo();
            setIsPlaying(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [activePlaylist]);

  // Controla play/pause sem recriar o player
  useEffect(() => {
    if (!playerRef.current || !readyRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  const handleSelect = (playlist) => {
    if (activePlaylist?.id === playlist.id) {
      setIsPlaying((prev) => !prev); // toggle na mesma playlist
    } else {
      setActivePlaylist(playlist);
      setPlayerKey((prev) => prev + 1); // troca de playlist
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500 text-xs uppercase tracking-widest">Music</p>
      <div className="flex gap-2 flex-wrap">
        {PLAYLISTS.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handleSelect(playlist)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activePlaylist?.id === playlist.id
                ? "bg-red-500 text-white"
                : "bg-[#2a2a2a] text-gray-400 hover:text-white"
            }`}
          >
            {playlist.emoji} {playlist.label}
            {activePlaylist?.id === playlist.id && (
              <span className="ml-1">{isPlaying ? "▐▐" : "▶"}</span>
            )}
          </button>
        ))}
      </div>
      {/* Container onde a YouTube API monta o player invisível */}
      {/* ← key no pai, ref no filho */}
      <div key={playerKey}>
        <div ref={containerRef} className="w-0 h-0 overflow-hidden absolute" />
      </div>
      {activePlaylist && (
        <p className="text-gray-600 text-xs">
          {isPlaying ? "▶" : "⏸"} {activePlaylist.label}
        </p>
      )}
      <div className="border-t border-[#2a2a2a] pt-4 flex flex-col gap-2">
        <p className="text-gray-400 text-sm">O que te motiva hoje?</p>
        <textarea
          rows={3}
          placeholder="Escreva aqui..."
          className="bg-[#2a2a2a] text-white text-sm rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-red-500 placeholder-gray-600"
        />
      </div>
    </div>
  );
}
