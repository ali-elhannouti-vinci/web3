import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <header>
          <NavBar />
      </header>
      
      <main className="flex-1 flex justify-center items-center">
        <div className="max-w-7xl mx-10 border border-amber-700">
          <Outlet />
        </div>
      </main>
      </div>
    </>
  );
}
