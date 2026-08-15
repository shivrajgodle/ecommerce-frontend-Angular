export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

// The DECODED payload of our JWT — matches exactly what
// JwtService.generateAccessToken() put in there back on the backend
// (Phase C, File 3b): subject (email), userId, roles, plus the
// standard iat/exp claims every JWT carries.
export interface JwtClaims {
  sub: string;
  userId: number;
  roles: string[];
  iat: number;
  exp: number;
}