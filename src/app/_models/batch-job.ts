export interface BatchJob {
  jobId: string;
  status: 'None' | 'Pending' | 'Running' | 'AwaitingConfirmation' | 'Completed' | 'Failed';
  progress: number;
  currentStep: string | null;
  warnings: string[];
  errorMessage: string | null;
}
