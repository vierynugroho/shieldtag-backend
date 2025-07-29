import jwt, { SignOptions, VerifyOptions, JwtPayload as JwtPayloadType } from 'jsonwebtoken';
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

// Helper to get sign options
const getSignOptions = (expiresIn: string | number): SignOptions => ({
  expiresIn: '1d',
  issuer: 'shieldtag-api',
  audience: 'shieldtag-app',
});

// Helper to get verify options
const getVerifyOptions = (): VerifyOptions => ({
  issuer: 'shieldtag-api',
  audience: 'shieldtag-app',
});

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret as jwt.Secret, getSignOptions(config.jwt.expiresIn));
};

// Generate refresh token
export const generateRefreshToken = (payload: Pick<JwtPayload, 'userId'>): string => {
  return jwt.sign(
    payload,
    config.jwt.refreshSecret as jwt.Secret,
    getSignOptions(config.jwt.refreshExpiresIn)
  );
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
    const decoded = jwt.verify(
      token,
      config.jwt.secret as jwt.Secret,
      getVerifyOptions()
    ) as JwtPayloadType;
    // Type assertion to our JwtPayload interface
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): Pick<JwtPayload, 'userId'> => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.refreshSecret as jwt.Secret,
      getVerifyOptions()
    ) as JwtPayloadType;
    // Only return userId
    return { userId: (decoded as any).userId };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
