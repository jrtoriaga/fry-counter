import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const pathname = useLocation().pathname
  return (
    <>
      <nav className={`w-full bg-lime-600 flex items-center px-4 text-white h-[66px]`}>
        {pathname === "/" ? null : (
          <Link className="border border-white rounded-md p-1 px-2" to="/">
            Home
          </Link>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
