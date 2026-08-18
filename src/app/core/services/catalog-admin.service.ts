import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { BulkUploadResult } from '../models/bulk-upload.model';

@Injectable({ providedIn: 'root' })
export class CatalogAdminService {
  private http = inject(HttpClient);

  async bulkUpload(file: File): Promise<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    /**
     * NOTE what's NOT here: no Content-Type header set manually.
     * When HttpClient's body is a FormData instance, the browser sets
     * Content-Type itself — specifically "multipart/form-data;
     * boundary=----WebKitFormBoundary...", where that boundary value
     * is a unique string the browser generates to separate the file's
     * raw bytes from other form fields in the request body. Setting
     * Content-Type manually to just "multipart/form-data" (a genuinely
     * common mistake) OMITS that boundary parameter, and the backend's
     * multipart parser can't parse the request body at all without it.
     */
    const response = await firstValueFrom(
      this.http.post<ApiResponse<BulkUploadResult>>(
        `${environment.apiUrl}/api/v1/products/bulk-upload`, formData
      )
    );
    return response.data;
  }

  async exportProducts(): Promise<Blob> {
    // responseType: 'blob' tells HttpClient "don't try to parse this
    // response as JSON" — return the raw bytes as a Blob instead. This
    // is the ONE place in this whole app where a response ISN'T the
    // ApiResponse envelope, because an .xlsx file isn't JSON at all.
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/api/v1/products/export`, { responseType: 'blob' })
    );
  }
}