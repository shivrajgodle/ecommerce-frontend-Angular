// Mirrors exactly what Spring Data's Page<T> serializes to as JSON —
// content/totalElements/totalPages/number/size/first/last/empty.
// This is a CONSUMER-OWNED CONTRACT, the same Anti-Corruption Layer
// pattern used throughout the backend (Cart Service's ProductInfo,
// Order Service's CartInfo, etc.) — the frontend defines its OWN
// minimal shape matching the wire format, rather than importing
// anything from the backend directly.
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index, 0-based
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}