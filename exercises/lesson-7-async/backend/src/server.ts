/* ==========================================================================
   1. IMPORTS
   ========================================================================== */
// Node Built-ins
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { type Express } from "express";

// Third-party Libraries
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pino } from "pino";
import cron from "node-cron";
import { Server as SocketServer } from "socket.io";
import { ruruHTML } from "ruru/server";

// Local Imports - Config & Utils
import { env } from "@/common/utils/envConfig";
import { serverAdapter } from "./config/bullBoard";

// Local Imports - Middlewares
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { authenticateSocket, type AuthenticatedSocket } from "./socket/authMiddleware";
import graphqlMiddleware from "./graphql/server";

// Local Imports - Routers
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import userRouter from "@/api/user/userRouter";
import expenseRouter from "./api/expense/expenseRouter";
import transferRouter from "./api/transfer/transferRouter";
import transactionRouter from "./api/transaction/transactionRouter";
import authRouter from "./api/auth/authRouter";

/* ==========================================================================
   2. CONFIGURATION & CONSTANTS
   ========================================================================== */
const logger = pino({ name: "server start" });
const reportsDir = path.join(process.cwd(), "reports");
// const isMainModule = path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
const shouldStartServer = process.argv.includes('--start-server');

/* ==========================================================================
   3. INITIALISATION SERVEUR (HTTP & SOCKET)
   ========================================================================== */
const app: Express = express();
const httpServer = createServer(app);

// Initialize Socket.io (Instancié tôt pour être disponible pour les webhooks si besoin)
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

/* ==========================================================================
   4. MIDDLEWARES GLOBAUX
   ========================================================================== */
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline only for dev
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

if (!env.isDevelopment) {
  app.use(rateLimiter);
}

app.use(requestLogger);

/* ==========================================================================
   5. ROUTES REST & STATIC
   ========================================================================== */

// 5.1 Webhooks (Internal)
app.post('/internal/webhook/report-ready', (req, res) => {
  const { userId, reportId, downloadUrl } = req.body;
  console.log(`📞 Webhook reçu : Notification pour User ${userId}`);

  io.to(`user-${userId}`).emit('report:ready', {
    userId,
    reportId,
    downloadUrl
  });

  res.json({ success: true });
});

// 5.2 Health Check & Static Files
app.use("/health-check", healthCheckRouter);
app.use("/reports", express.static(reportsDir));

// 5.3 API Routes
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/transfers", transferRouter);
app.use("/api/transactions", transactionRouter);
app.use("/auth", authRouter);

/* ==========================================================================
   6. DEVELOPMENT TOOLS (RURU & BULL BOARD)
   ========================================================================== */
if (env.isDevelopment) {
  const config = { endpoint: "/graphql" };
  
  // Serve Ruru HTML
  app.get("/ruru", (req, res) => {
    res.format({
      html: () => res.status(200).send(ruruHTML(config)),
      default: () => res.status(406).send("Not Acceptable"),
    });
  });

  // Bull Board
  app.use("/admin/queues", serverAdapter.getRouter());
  console.log("📊 Bull Board available at http://localhost:3000/admin/queues");
}

/* ==========================================================================
   7. GRAPHQL & ERROR HANDLING
   ========================================================================== */
app.use("/graphql", graphqlMiddleware);

// Error handlers (Doit être le dernier app.use)
app.use(errorHandler());

/* ==========================================================================
   8. LOGIQUE SOCKET.IO
   ========================================================================== */
io.use(authenticateSocket);

io.on("connection", (socket: AuthenticatedSocket) => {
  const userId = socket.user?.userId;
  console.log(`🔌 User ${userId} connected: ${socket.id}`);

  socket.join(`user-${userId}`);
  console.log(`✅ Socket a rejoint la room: user-${userId}`);
  
  socket.on("disconnect", (reason) => {
    console.log(`🔌 User ${userId} disconnected: ${socket.id} (${reason})`);
  });
});

/* ==========================================================================
   9. CRON JOBS (Background Tasks)
   ========================================================================== */
// Nettoyage des rapports toutes les 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏳ Vérification des vieux rapports à supprimer...");

  fs.readdir(reportsDir, (err, files) => {
    if (err) {
      console.error("Erreur lecture dossier:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(reportsDir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Erreur lecture fichier:", err);
          return;
        }

        const now = Date.now();
        const ageDuFichier = now - stats.mtimeMs;
        const limiteAge = 300000; // 5 minutes

        if (ageDuFichier > limiteAge) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Erreur suppression:", err);
            else console.log(`🗑️ Fichier supprimé (vieux de +5min) : ${file}`);
          });
        }
      });
    });
  });
});

/* ==========================================================================
   10. DÉMARRAGE DU SERVEUR
   ========================================================================== */
const PORT = process.env.PORT || 3000;

if (shouldStartServer) {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
} else {
  console.log("ℹ️ Server.ts importé en tant que module (Pas de démarrage de port)");
}

export { app, logger, io };