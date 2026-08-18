import { Component, inject, signal } from '@angular/core';
import { Card } from "../../../shared/ui/card/card";
import { Button } from "../../../shared/ui/button/button";
import { CatalogAdminService } from '../../../core/services/catalog-admin.service';
import { ToastService } from '../../../shared/ui/toast/toast-service';
import { BulkUploadResult } from '../../../core/models/bulk-upload.model';

@Component({
  selector: 'app-bulk-upload',
  imports: [Card, Button],
  templateUrl: './bulk-upload.html',
  styleUrl: './bulk-upload.scss',
})
export class BulkUpload {

  private catalogAdminService = inject(CatalogAdminService);
  private toast = inject(ToastService);

  protected isDragging = signal(false);
  protected selectedFile = signal<File | null>(null);
  protected uploading = signal(false);
  protected result = signal<BulkUploadResult | null>(null);

  onDragOver(event: DragEvent) {
    event.preventDefault(); // required — without this, the browser's DEFAULT behavior is to try to OPEN/navigate to the dropped file, not let our drop handler run at all
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.selectedFile.set(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.selectedFile.set(file);
  }

  async upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.result.set(null);
    try {
      const result = await this.catalogAdminService.bulkUpload(file);
      this.result.set(result);
      if (result.failureCount === 0) {
        this.toast.success(`All ${result.successCount} rows imported successfully`);
      } else {
        this.toast.error(`${result.failureCount} of ${result.totalRows} rows failed — see details below`);
      }
      this.selectedFile.set(null);
    } catch {
      // errorInterceptor handles the toast for outright request failures
    } finally {
      this.uploading.set(false);
    }
  }

}
