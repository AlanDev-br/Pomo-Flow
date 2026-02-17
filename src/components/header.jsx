export function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-6 text-white">
        <button className="bg-red-500 px-4 py-2 rounded-xl">Home</button>
        <button className="hover:text-red-400 transition">Statistics</button>
        <button className="hover:text-red-400 transition">Profile</button>
        <button className="hover:text-red-400 transition">Settings</button>
      </div>
    </div>
  );
}
