export interface GeneratePdfJobData {
  userId: number;
  startDate?: Date | string; // Support both Date and string (BullMQ serialization)
  endDate?: Date | string;
  reportId: string; // Unique ID for this report
}

export interface PdfJobResult {
  reportId: string;
  filePath: string;
  generatedAt: Date;
}