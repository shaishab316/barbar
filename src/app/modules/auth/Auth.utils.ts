import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { errorLogger } from '../../../util/logger/logger';
import colors from 'colors';
export type TTokenType = 'access' | 'reset' | 'refresh';

/**
 * Create a token
 * @param payload - The payload to sign
 * @param type - The type of token to create
 * @returns The signed token
 */
export const createToken = (payload: JwtPayload, type: TTokenType) => {
  payload.tokenType = type;

  try {
    switch (type) {
      case 'access':
        return jwt.sign(payload, config.jwt.access_token.secret, {
          expiresIn: config.jwt.access_token.expire_in,
        });
      case 'reset':
        return jwt.sign(payload, config.jwt.access_token.secret, {
          expiresIn: '10m',
        });
      case 'refresh':
        return jwt.sign(payload, config.jwt.refresh_token.secret, {
          expiresIn: config.jwt.refresh_token.expire_in,
        });
    }
  } catch (error) {
    errorLogger.error(colors.red('🔑 Failed to create token'), error);
    throw new ServerError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create token',
    );
  }
};

/**
 * Verify a token
 * @param token - The token to verify
 * @param type - The type of token to verify
 * @returns The decoded token
 */
export const verifyToken = (token: string, type: TTokenType) => {
  try {
    switch (type) {
      case 'access':
        return jwt.verify(token, config.jwt.access_token.secret) as JwtPayload;
      case 'reset':
        return jwt.verify(token, config.jwt.access_token.secret) as JwtPayload;
      case 'refresh':
        return jwt.verify(token, config.jwt.refresh_token.secret) as JwtPayload;
    }
  } catch (error) {
    errorLogger.error(colors.red('🔑 Failed to verify token'), error);
    throw new ServerError(StatusCodes.UNAUTHORIZED, 'Invalid token');
  }
};

/**
 * Generate a random 6-digit OTP
 * @returns A 6-digit OTP
 */
export const generateOtp = () =>
  Math.floor(1_00_000 + Math.random() * 9_00_000);
