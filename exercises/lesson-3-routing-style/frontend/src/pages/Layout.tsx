import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  return (
    <>
    <div className="min-h-screen flex flex-col lg:text-lg leading-relaxed">
      <header>
          <NavBar />
      </header>
      
      <main className="flex-1 flex justify-center items-center">
        <div className="max-w-7xl w-full my-2 mx-10 px-4 sm:px-6 lg:px-8 border border-amber-700">
          <Outlet />
        </div>
      </main>
      </div>
      <Toaster position="top-center"/>
    </>
  );
}
