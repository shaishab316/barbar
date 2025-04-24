/* eslint-disable no-unused-expressions */
import { RequestHandler } from 'express';

/**
 * Wraps an Express request handler to catch and handle async errors
 *
 * @param fn - The Express request handler function to wrap
 * @returns A wrapped request handler that catches async errors
 */
const catchAsync =
  (fn: RequestHandler<any, any, any, any>): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req as any, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchAsync;
