import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-6">

        <div className="col-span-2">
          <Sidebar />
        </div>

        <div className="col-span-8">
          <Outlet />
        </div>

        <div className="col-span-2">
          <RightSidebar />
        </div>

      </div>

      <Footer />

    </div>
  );
}

export default MainLayout;
