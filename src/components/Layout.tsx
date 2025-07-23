import { Link, Outlet } from "react-router-dom";

import logo from '../assets/fish.svg'

export default function Layout() {
  return (
    <div className="bg-[linear-gradient(80deg,#B7F2FF,#9FEB97)] h-screen p-8 px-4 pt-4 text-gray-700">
      <nav className=" bg-white/40 backdrop-blur-md rounded-2xl  px-4 py-2">
      <Link to={'/'} className="flex items-center gap-4">
        <div className="px-4 py-1 bg-green-500 rounded-2xl">
            <img src={logo} alt="logo" className="size-6" />
        </div>

        <span className="text-xl font-medium">
          JRT
        </span>
      </Link>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
