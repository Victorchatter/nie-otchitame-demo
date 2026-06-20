export const REPORT_TYPES = ['revenue', 'expense', 'project', 'hr'] as const;
export const STATUSES = ['draft', 'submitted', 'approved'] as const;

export type ReportType = (typeof REPORT_TYPES)[number];
export type Status = (typeof STATUSES)[number];

export interface Report {
  id: number;
  title: string;
  report_type: ReportType;
  amount: number;
  date: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface ReportCreate {
  title: string;
  report_type: ReportType;
  amount: number;
  date: string;
  status: Status;
}

export interface Metrics {
  total_count: number;
  total_amount: number;
  by_type: Record<ReportType, number>;
  by_status: Record<Status, number>;
}
