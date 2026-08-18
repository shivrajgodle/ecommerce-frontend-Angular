import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { SalesReportResponse } from '../models/sales-report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);

  async getSalesReport(startDate: string, endDate: string): Promise<SalesReportResponse> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SalesReportResponse>>(
        `${environment.apiUrl}/api/v1/orders/reports/sales`, { params }
      )
    );
    return response.data;
  }

  async exportSalesReport(startDate: string, endDate: string): Promise<Blob> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/api/v1/orders/reports/sales/export`, {
        params, responseType: 'blob',
      })
    );
  }
}