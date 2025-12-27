import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { useExpenseEvents } from "@/hooks/useExpenseEvents";

export default function Layout() {
  useExpenseEvents(); // Register event listeners

  return (
    <div>
      <Header />

      <main className="p-6">
        <Outlet />
      </main>

      <Toaster
        richColors // Force les couleurs (Vert = Succès, Rouge = Erreur)
        closeButton // Ajoute une petite croix pour fermer
      />
    </div>
  );
}
