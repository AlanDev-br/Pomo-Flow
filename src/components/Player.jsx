import { useState, useEffect, useRef } from "react";

const PLAYLISTS = [
  { id: "lofi", label: "Lo-fi", emoji: "🎵", videoId: "jfKfPfyJRdk" },
  { id: "jazz", label: "Jazz", emoji: "🎷", videoId: "Dx5qFachd3A" },
  { id: "acoustic", label: "Acoustic", emoji: "🪕", videoId: "c6JAn-IGX6o" },
  { id: "nature", label: "Nature", emoji: "🌿", videoId: "q76bMs-NwRk" },
];

export function Player() {
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [volume, setVolume] = useState(1); // volume de 0 a 1
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);

  // Carrega o script da YouTube API uma vez
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Cria um novo player quando a playlist muda
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
        videoId: activePlaylist.videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: activePlaylist.videoId,
        },
        events: {
          onReady: (e) => {
            readyRef.current = true;
            e.target.unMute();
            e.target.setVolume(volume * 100); // aplica volume atual ao iniciar
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

  // Atualiza o volume no player quando o fader muda
  useEffect(() => {
    if (!playerRef.current || !readyRef.current) return;
    playerRef.current.setVolume(volume * 100);
  }, [volume]);

  const handleSelect = (playlist) => {
    if (activePlaylist?.id === playlist.id) {
      setIsPlaying((prev) => !prev);
    } else {
      setPlayerKey((prev) => prev + 1);
      setActivePlaylist(playlist);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500 text-xs uppercase tracking-widest">Music</p>

      {/* Botões de seleção de playlist */}
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

      {/* Fader de volume — só aparece quando tem playlist ativa */}
      {activePlaylist && (
        <div className="flex items-center gap-3 mt-1">
          <span className="text-gray-600 text-xs">🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 rounded-full accent-red-500 cursor-pointer"
          />
          <span className="text-gray-600 text-xs">🔊</span>
        </div>
      )}

      {/* Container invisível onde a YouTube API monta o player */}
      <div key={playerKey}>
        <div ref={containerRef} className="w-0 h-0 overflow-hidden absolute" />
      </div>

      {/* Status da playlist ativa */}
      {activePlaylist && (
        <p className="text-gray-600 text-xs">
          {isPlaying ? "▶" : "⏸"} {activePlaylist.label}
        </p>
      )}

      {/* Campo de motivação do dia */}
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
