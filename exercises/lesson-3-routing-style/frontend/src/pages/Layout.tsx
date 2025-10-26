import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <>
    <div className="min-h-screen flex flex-col lg:text-lg leading-loose">
      <header>
          <NavBar />
      </header>
      
      <main className="flex-1 flex justify-center items-center">
        <div className="max-w-7xl my-2 mx-10 px-4 sm:px-6 lg:px-8 border border-amber-700">
          <Outlet />
        </div>
      </main>
      </div>
    </>
  );
}
