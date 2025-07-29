import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// JWT Payload interface
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions?: string[];
}

// Token response interface
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'shieldtag-api',
    audience: 'shieldtag-app',
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: Pick<JwtPayload, 'userId'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'shieldtag-api',
    audience: 'shieldtag-app',
  });
};

// Generate both tokens
export const generateTokens = (payload: JwtPayload): TokenResponse => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: payload.userId });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
  };
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: 'shieldtag-api',
      audience: 'shieldtag-app',
    }) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): Pick<JwtPayload, 'userId'> => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'shieldtag-api',
      audience: 'shieldtag-app',
    }) as Pick<JwtPayload, 'userId'>;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
