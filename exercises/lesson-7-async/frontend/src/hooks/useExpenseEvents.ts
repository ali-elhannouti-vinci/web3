import { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";
import type {
  ExpenseCreatedEvent,
  ReportReadyEvent,
} from "@/types/SocketEvents";

export function useExpenseEvents() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle expense created
    const handleExpenseCreated = (event: ExpenseCreatedEvent) => {
      console.log("📥 Expense created event:", event);

      toast.success(`New expense: ${event.description}`, {
        description: `€${event.amount.toFixed(2)} paid by ${event.payerName}`,
        duration: 15000,
      });
    };

    // Handle report ready
    const handleReportReady = (event: ReportReadyEvent) => {
      console.log("📥 Report ready event:", event);

      toast.success("Your expense report is ready!", {
        description: "Click here to download",
        duration: Infinity, // Je recommande Infinity pour laisser le temps de cliquer
        action: {
          label: "Download",
          // 👇 La fonction devient ASYNC ici
          onClick: async () => {
            const fullUrl = `${import.meta.env.VITE_API_URL}${
              event.downloadUrl
            }`;
            // On génère un nom de fichier propre pour l'utilisateur
            const filename = `Expense_Report_${event.reportId}.pdf`;

            try {
              // 1. On va chercher le fichier (Backend -> Mémoire du navigateur)
              const response = await fetch(fullUrl);

              if (!response.ok) throw new Error("Network response was not ok");

              // 2. On transforme la réponse en "Blob" (Fichier binaire)
              const blob = await response.blob();

              // 3. On crée une URL temporaire locale
              const blobUrl = window.URL.createObjectURL(blob);

              // 4. On crée le lien invisible et on clique dessus
              const link = document.createElement("a");
              link.href = blobUrl;
              link.setAttribute("download", filename); // Force le téléchargement
              document.body.appendChild(link);
              link.click();

              // 5. Nettoyage
              link.remove();
              window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
              console.error(
                "❌ Download failed, falling back to window.open",
                error
              );
              // Sécurité : Si le fetch échoue (ex: erreur CORS), on ouvre dans un nouvel onglet
              window.open(fullUrl, "_blank");
            }
          },
        },
      });
    };

    // VERSION AVEC TELECHARGEMENT AUTOMATIQUE DU RAPPORT

    // // Handle report ready
    // const handleReportReady = async (event: ReportReadyEvent) => {
    //   // 👈 Ajoutez async
    //   console.log("📥 Report ready event:", event);

    //   const fullUrl = `${import.meta.env.VITE_API_URL}${event.downloadUrl}`;
    //   const filename = `Rapport_Depense_${event.reportId}.pdf`;

    //   try {
    //     // 1. On va chercher le fichier via Javascript
    //     const response = await fetch(fullUrl);

    //     // 2. On le convertit en "Blob" (Binary Large Object)
    //     const blob = await response.blob();

    //     // 3. On crée une URL "interne" temporaire
    //     const blobUrl = window.URL.createObjectURL(blob);

    //     // 4. On crée le lien magique
    //     const link = document.createElement("a");
    //     link.href = blobUrl;
    //     link.setAttribute("download", filename); // Là, ça va marcher !

    //     // 5. On clique et on nettoie
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);

    //     // Libère la mémoire
    //     window.URL.revokeObjectURL(blobUrl);

    //     // Notification de succès
    //     toast.success("Rapport téléchargé !", { duration: 3000 });
    //   } catch (e) {
    //     console.error("Erreur téléchargement blob:", e);
    //     // Fallback : Si le blob échoue, on ouvre dans un nouvel onglet
    //     window.open(fullUrl, "_blank");
    //   }
    // };

    // Register listeners
    socket.on("expense:created", handleExpenseCreated);
    socket.on("report:ready", handleReportReady);

    // Cleanup
    return () => {
      socket.off("expense:created", handleExpenseCreated);
      socket.off("report:ready", handleReportReady);
    };
  }, [socket, isConnected]);
}
