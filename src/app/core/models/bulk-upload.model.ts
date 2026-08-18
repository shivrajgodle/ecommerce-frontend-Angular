export interface RowError {
  rowNumber: number;
  sku: string | null;
  reason: string;
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: RowError[];
}