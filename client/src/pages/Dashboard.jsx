import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sideBar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768;
  });

  return (
    <div className="relative min-h-screen bg-slate-100">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        className={`min-h-screen transition-[margin-left] duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "ml-0 md:ml-14"
        }`}
      >
        <div className="min-h-screen bg-white">
          <Navbar isSidebarOpen={isSidebarOpen} selectedCategory={selectedCategory} />
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet context={{ selectedCategory }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/sideBar";
// import Navbar from "../components/Navbar";

// function Dashboard() {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
//     if (typeof window === "undefined") return false;
//     return window.innerWidth >= 768;
//   });

//   return (
//     <div className="relative min-h-screen bg-slate-100">
//       <Sidebar
//         selectedCategory={selectedCategory}
//         onCategorySelect={setSelectedCategory}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//       />

//       <div
//         className={`min-h-screen transition-[margin-left] duration-300 ease-in-out ${
//           isSidebarOpen ? "md:ml-64" : "ml-0 md:ml-14"
//         }`}
//       >
//         <div className="min-h-screen border border-white/40 bg-white/55 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-md">
//           <Navbar isSidebarOpen={isSidebarOpen} />
//           <div className="p-4 sm:p-6 lg:p-8">
//             <Outlet context={{ selectedCategory }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
