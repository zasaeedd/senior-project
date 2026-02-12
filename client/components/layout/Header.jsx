export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow-sm p-4">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back, Student 👋</h2>
        <p className="text-gray-500 text-sm">Let’s continue learning!</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>

        {/* Placeholder Profile Pic */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
}
