import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  console.log(process.env.NODE_ENV);

  // Exemple d'utilisation dans une condition :
  if (process.env.NODE_ENV === "development") {
    console.log("Nous sommes en mode Développement.");
  } else {
    console.log("Nous sommes en mode Production ou autre.");
  }

  // Déterminez si nous sommes en mode développement
  const isDev = process.env.NODE_ENV === "development";

  // Définissez la classe racine conditionnellement
  const rootClass = isDev ? "debug-active" : "";
  return (
    <>
      <div
        className={
          "min-h-screen flex flex-col lg:text-lg leading-relaxed " + rootClass
        }
      >
        <header>
          <NavBar />
        </header>

        <main className="flex-1 flex justify-center items-center">
          <div className="max-w-7xl w-full my-2 mx-10 px-4 sm:px-6 lg:px-8 debug-border-layout">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
