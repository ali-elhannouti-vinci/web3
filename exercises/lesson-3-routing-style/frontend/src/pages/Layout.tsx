import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <>
      <NavBar />

      <main className="max-w-7xl mx-10 border border-amber-700">
        <Outlet />
      </main>
    </>
  );
}
