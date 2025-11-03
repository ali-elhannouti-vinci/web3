import { Prisma } from '../../../generated/prisma';
import { StatusCodes } from 'http-status-codes';

// Définit la structure de l'objet d'erreur que nous lançons
interface HttpError {
  status: StatusCodes;
  message: string;
}

/**
 * Extrait la partie pertinente de l'erreur de Prisma (P2xxx)
 * en ignorant les chemins de fichiers et les détails d'invocation.
 * @param fullMessage Le message d'erreur brut de Prisma.
 * @returns Le message d'erreur nettoyé.
 */
function extractPrismaErrorMessage(fullMessage: string): string {
    // 1. Diviser le message par les sauts de ligne pour traiter ligne par ligne
    const lines = fullMessage.split('\n');

    // 2. Chercher la ligne qui commence par la description de l'erreur
    // L'erreur utile commence souvent après l'invocation de la fonction Prisma.
    
    // On peut chercher le point final de l'invocation pour commencer la recherche.
    // L'invocation se termine par ')' ou '→'
    
    let isErrorSection = false;
    let relevantMessage = '';

    for (const line of lines) {
        // Commencer à capturer après le bloc d'invocation de la fonction (où la ligne commence par des espaces)
        if (line.trim().startsWith('return prisma.')) {
            // Une fois que l'on passe la ligne de l'invocation (où le → se trouve)
            isErrorSection = true; 
            continue;
        }

        // Si nous sommes dans la section d'erreur et que la ligne n'est pas vide/code
        if (isErrorSection && line.trim().length > 0 && !line.includes('prisma.expense.create()')) {
            // La première ligne capturée après l'invocation est souvent la plus pertinente.
            relevantMessage = line.trim();
            break; 
        }
    }
    
    // Si la boucle n'a rien trouvé, prendre la dernière ligne (parfois utile)
    if (!relevantMessage) {
        relevantMessage = lines.pop()?.trim() || "Une erreur de base de données est survenue.";
    }

    return relevantMessage;
}

/**
 * Traduit une erreur lancée par Prisma ou le système en un objet d'erreur HTTP standard.
 * @param error L'objet d'erreur capturé dans le bloc catch.
 * @returns Un objet { status, message } prêt à être renvoyé au client.
 */
export function mapPrismaError(error: unknown): HttpError {
  // 1. Gérer les erreurs de requêtes connues de Prisma (P2xxx)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const cleanMessage = extractPrismaErrorMessage(error.message);
    switch (error.code) {
      case 'P2002': // Contrainte UNIQUE violée
        // Récupérer le champ spécifique si disponible
        const target = (error.meta?.target as string | undefined)?.replace(/_/g, ' ');
        return { 
          status: StatusCodes.CONFLICT, // 409
          message: cleanMessage
        };

      case 'P2003': // Contrainte de Clé Étrangère violée (Référence invalide)
        return { 
          status: StatusCodes.BAD_REQUEST, // 400
          message: cleanMessage
        };

      case 'P2025': // Enregistrement non trouvé pour une opération (Ex: update/delete sans where suffisant)
        // Bien que souvent géré au niveau du code, il est parfois intercepté ici.
        return { 
          status: StatusCodes.BAD_REQUEST, // 400
          message: cleanMessage
        };

      default:
        // Toutes les autres erreurs P2xxx (Problèmes d'entrée/contraintes générales)
        return { 
          status: StatusCodes.BAD_REQUEST, // 400
          message: cleanMessage
        };
    }

  } 
  
  // 2. Gérer les erreurs de validation client (ex: champ non fourni)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return { 
      status: StatusCodes.BAD_REQUEST, // 400
      message: "Erreur de validation des données fournies (champ manquant ou mauvais type)." 
    };
  }

  // 3. Gérer les erreurs inconnues ou internes (crashs, paniques Rust, etc.)
  return { 
    status: StatusCodes.INTERNAL_SERVER_ERROR, // 500
    message: "Erreur interne imprévue." 
  };
}