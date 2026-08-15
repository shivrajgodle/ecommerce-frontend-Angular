export const environment = {
  production: false,
  // The API GATEWAY's address (Phase D of the backend) — the frontend
  // NEVER talks to Identity/Catalog/Cart/etc. directly. This one URL
  // is the entire frontend's view of the backend, exactly as designed.
  apiUrl: 'http://localhost:8080',
};