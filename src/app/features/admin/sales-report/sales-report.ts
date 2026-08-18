import { Component, inject, signal } from '@angular/core';
import { Card } from "../../../shared/ui/card/card";
import { Button } from "../../../shared/ui/button/button";
import { OrderStatusBadgeComponent } from "../../../shared/ui/order-status-badge/order-status-badge.component";
import { ReportService } from '../../../core/services/report.service';
import { FileDownloadService } from '../../../core/services/file-download.service';
import { SalesReportResponse } from '../../../core/models/sales-report.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sales-report',
  imports: [Card, Button, OrderStatusBadgeComponent,CurrencyPipe],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.scss',
})
export class SalesReport {
  private reportService = inject(ReportService);
  private fileDownloadService = inject(FileDownloadService);

  // Default to a sensible recent window rather than forcing the admin
  // to pick dates before seeing anything useful — first day of the
  // current year through today.
  protected startDate = signal(`${new Date().getFullYear()}-01-01`);
  protected endDate = signal(new Date().toISOString().split('T')[0]);

  protected report = signal<SalesReportResponse | null>(null);
  protected loading = signal(false);
  protected exporting = signal(false);

  async generate() {
    this.loading.set(true);
    try {
      this.report.set(await this.reportService.getSalesReport(this.startDate(), this.endDate()));
    } finally {
      this.loading.set(false);
    }
  }

  async exportReport() {
    this.exporting.set(true);
    try {
      const blob = await this.reportService.exportSalesReport(this.startDate(), this.endDate());
      this.fileDownloadService.triggerDownload(blob, `sales-report-${this.startDate()}-to-${this.endDate()}.xlsx`);
    } finally {
      this.exporting.set(false);
    }
  }
}
