// GlobalErrorPage.jsx
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function GlobalErrorPage() {
  const error = useRouteError(); // ⬅️ Récupère l'erreur lancée

  let errorMessage = "Une erreur inconnue est survenue.";
  
  if (isRouteErrorResponse(error)) {
    // Gère les erreurs renvoyées par une Response (ex: 404, 401)
    errorMessage = `${error.status} ${error.statusText || error.data}`;
  } else if (error instanceof Error) {
    // Gère les erreurs lancées (comme dans le cas de l'échec de ApiClient.getUsers())
    errorMessage = error.message;
  }
  // Pour les autres types d'erreurs, on garde le message par défaut

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1>❌ Erreur de Chargement</h1>
      <p>Impossible de charger les données nécessaires pour l'application.</p>
      <p className="text-red-500 font-mono mt-4">{errorMessage}</p>
    </div>
  );
}