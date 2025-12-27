export interface ExpenseCreatedEvent {
  expenseId: number;
  description: string;
  amount: number;
  payerId: number;
  payerName: string;
  participantIds: number[];
}

export interface ExpenseUpdatedEvent {
  expenseId: number;
  description: string;
  amount: number;
}

export interface ReportReadyEvent {
  reportId: string;
  userId: number;
  downloadUrl: string;
}