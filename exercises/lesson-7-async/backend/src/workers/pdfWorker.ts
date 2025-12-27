import { Worker, Job } from 'bullmq';
import { redisConnection } from '@/config/redis';
import { PDF_QUEUE_NAME } from '@/queues/pdfQueue';
import { generateExpenseReport } from '@/services/pdfGenerator';
import type { GeneratePdfJobData, PdfJobResult } from '@/types/JobTypes';
// import { emitReportReady } from '@/socket/events';

export const pdfWorker = new Worker<GeneratePdfJobData, PdfJobResult>(
  PDF_QUEUE_NAME,
  async (job: Job<GeneratePdfJobData>) => {
    console.log(`📄 Processing PDF job ${job.id} for user ${job.data.userId}`);

    try {
      // Update job progress
      await job.updateProgress(10);

      // Generate PDF
      const filePath = await generateExpenseReport({
        userId: job.data.userId,
        startDate: job.data.startDate,
        endDate: job.data.endDate,
      });

      await job.updateProgress(90);

      console.log(`✅ PDF generated: ${filePath}`);

      await job.updateProgress(100);

      return {
        reportId: job.data.reportId,
        filePath,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error(`❌ PDF generation failed for job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Process up to 2 PDFs at a time
  }
);

// Event handlers
// ✅ REMPLACE ton bloc 'completed' par ceci :
pdfWorker.on('completed', async (job, returnvalue) => {
  console.log(`✅ Job ${job.id} terminé avec succès.`);

  // On vérifie qu'on a bien un résultat (le 2ème argument)
  if (returnvalue) {
    try {
      // 1. Définir l'URL du serveur principal
      // Utilise la variable d'env ou localhost:3000 par défaut
      const SERVER_URL = process.env.VITE_API_URL || 'http://localhost:3000';
      
      // 2. Appeler le serveur (Le coup de fil)
      await fetch(`${SERVER_URL}/internal/webhook/report-ready`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          userId: job.data.userId,
          reportId: returnvalue.reportId,
          downloadUrl: `/reports/${returnvalue.filePath}`, // L'URL relative du PDF
        }),
      });
      
      console.log(`📞 Notification envoyée au serveur pour User ${job.data.userId}`);
    } catch (err) {
      console.error("❌ Le Worker n'a pas réussi à appeler le Serveur :", err);
    }
  }
});

pdfWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

pdfWorker.on('error', (err) => {
  console.error('❌ Worker error:', err);
});

console.log('🚀 PDF Worker started');