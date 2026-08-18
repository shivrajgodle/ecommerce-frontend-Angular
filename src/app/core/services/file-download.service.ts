import { Injectable } from '@angular/core';

/**
 * A genuinely small, single-purpose utility — but worth its own
 * service rather than duplicating this browser-API dance inline in
 * two different feature components (catalog export, report export).
 * Same "duplicate twice before generalizing" instinct as the backend's
 * requireAdmin() — this is exactly the SECOND use case that justifies
 * pulling it out.
 */
@Injectable({ providedIn: 'root' })
export class FileDownloadService {

  triggerDownload(blob: Blob, filename: string) {
    // Blob -> a temporary browser-internal URL representing that
    // in-memory data — NOT a real network URL, nothing is fetched
    // from it.
    const url = URL.createObjectURL(blob);

    // The browser has no API to "just download this blob" directly —
    // the established technique is: create an <a> tag that was never
    // actually added to the visible page, point it at the object URL,
    // set its `download` attribute (which is what tells the browser
    // "save this, don't navigate to it"), and programmatically click it.
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    // CRITICAL — without this, the browser holds that blob's memory
    // allocated for the lifetime of the page (object URLs are not
    // automatically garbage collected the way normal JS objects are).
    // A user exporting several large reports in one session without
    // this line would slowly leak memory, one export at a time.
    URL.revokeObjectURL(url);
  }
}