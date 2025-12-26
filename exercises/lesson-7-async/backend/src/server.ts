import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import userRouter from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import expenseRouter from "./api/expense/expenseRouter";
import transferRouter from "./api/transfer/transferRouter";
import transactionRouter from "./api/transaction/transactionRouter";
import authRouter from "./api/auth/authRouter";
import graphqlMiddleware from "./graphql/server";
import { ruruHTML } from "ruru/server";
import { serverAdapter } from "./config/bullBoard";
import { queuePdfGeneration } from "./queues/pdfQueue";
import path from "path";
import cron from "node-cron";
import fs from "fs";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import {
  authenticateSocket,
  type AuthenticatedSocket,
} from "./socket/authMiddleware";

const logger = pino({ name: "server start" });
const app: Express = express();
const httpServer = createServer(app);

// Utilisation de process.cwd() comme demandé
const reportsDir = path.join(process.cwd(), "reports");

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

if (env.isDevelopment) {
  const config = { endpoint: "/graphql" };
  // Serve Ruru HTML
  app.get("/ruru", (req, res) => {
    res.format({
      html: () => res.status(200).send(ruruHTML(config)),
      default: () => res.status(406).send("Not Acceptable"),
    });
  });

  // Bull Board (only in development or with auth)
  app.use("/admin/queues", serverAdapter.getRouter());
  console.log("📊 Bull Board available at http://localhost:3000/admin/queues");
}

// Initialize Socket.io
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// Apply authentication
io.use(authenticateSocket);

// Socket.io connection handler
io.on("connection", (socket: AuthenticatedSocket) => {
  const userId = socket.user?.userId;
  console.log(`🔌 User ${userId} connected: ${socket.id}`);

  // Join user-specific room
  socket.join(`user-${userId}`);
  console.log(`✅ Socket a rejoint la room: user-${userId}`);
  socket.on("disconnect", (reason) => {
    console.log(`🔌 User ${userId} disconnected: ${socket.id} (${reason})`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Middlewares
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
    crossOriginEmbedderPolicy: false, // For development with external resources
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);

app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/transfers", transferRouter);
app.use("/api/transactions", transactionRouter);
app.use("/auth", authRouter);
app.use("/reports", express.static(reportsDir));
// Exécution toutes les 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏳ Vérification des vieux rapports à supprimer...");

  fs.readdir(reportsDir, (err, files) => {
    if (err) {
      console.error("Erreur lecture dossier:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(reportsDir, file);

      // On récupère les infos du fichier (date de création/modif)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Erreur lecture fichier:", err);
          return;
        }

        const now = Date.now();
        // Temps écoulé en millisecondes depuis la dernière modification
        const ageDuFichier = now - stats.mtimeMs;
        // 5 minutes = 1000 * 60 * 5 = 300 000 ms
        const limiteAge = 300000;

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
app.use("/graphql", graphqlMiddleware);

// Error handlers
app.use(errorHandler());

export { app, logger, io };
