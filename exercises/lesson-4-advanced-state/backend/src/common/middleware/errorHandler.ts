import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { mapPrismaError } from "../utils/error.mapper";


const unexpectedRequest: RequestHandler = (_req, res) => {
	res.status(StatusCodes.NOT_FOUND).send("Not Found");
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
	res.locals.err = err;
	next(err);
};

// 3. Gestionnaire d'erreurs final
const finalErrorHandler: ErrorRequestHandler = (err: unknown, req, res, next) => {
    
    // 1. Utiliser le mapper pour obtenir l'objet d'erreur propre
    // Le mapper gère les erreurs Prisma et les transforme en { status, message }
    const httpError = mapPrismaError(err); 

    const status = httpError.status;
    let message = httpError.message;

    // 2. Gestion des erreurs 500 (logging et sécurité)
    if (status >= StatusCodes.INTERNAL_SERVER_ERROR) {
        // Loguer l'erreur complète pour le débogage serveur
        console.error(`[FATAL ERROR] ${req.method} ${req.originalUrl}:`, res.locals.err || err);
        message = "Internal Server Error"; 
    }

    // 3. Envoyer la réponse JSON au client
    res.status(status).json({
        error: message,
    });
};

export default (): [RequestHandler, ErrorRequestHandler,ErrorRequestHandler] => [unexpectedRequest, addErrorToRequestLog,finalErrorHandler];
