/* eslint-disable no-unused-expressions */
import { RequestHandler } from 'express';
import { Types } from 'mongoose';

/**
 * Wraps an Express request handler to catch and handle async errors
 *
 * @param fn - The Express request handler function to wrap
 * @returns A wrapped request handler that catches async errors
 */
const catchAsync =
  (
    fn: RequestHandler<
      { [key: string]: Types.ObjectId },
      any,
      any,
      { [key: string]: number | string }
    >,
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req as any, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchAsync;
