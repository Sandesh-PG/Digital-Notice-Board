import { Outlet } from "react-router-dom";
import Sidebar from "../components/sideBar";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen w-full flex-col overflow-hidden border border-white/40 bg-white/55 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-md md:flex-row">
        <Sidebar />
        <div className="flex-1 bg-transparent">
          <Navbar />
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;