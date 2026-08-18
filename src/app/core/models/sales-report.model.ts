import { OrderStatus } from './order.model';

export interface StatusStat {
  status: OrderStatus;
  count: number;
  totalAmount: number;
}

export interface SalesReportResponse {
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  statusBreakdown: StatusStat[];
}