// import React from "react";

// const Header: React.FC = () => {
//   return (
//     <header className="flex justify-between items-center bg-white shadow-sm p-4">
//       <div>
//         <h2 className="text-2xl font-semibold">
//           Welcome back, Student 👋
//         </h2>
//         <p className="text-gray-500 text-sm">
//           Let’s continue learning!
//         </p>
//       </div>

//       <div className="flex items-center gap-3">
//         {/* Notification Bell */}
//         <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>

//         {/* Placeholder Profile Pic */}
//         <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur border-b">
      
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Welcome back, Student 👋
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Let’s continue learning!
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-blue-50 transition">
          <span className="text-lg">🔔</span>

          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border">
          
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
            S
          </div>

          {/* Name (optional, you can remove if you want minimal UI) */}
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            Student
          </span>
        </div>

      </div>
    </header>
  );
};

export default Header;