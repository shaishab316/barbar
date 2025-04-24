import { AnyZodObject } from 'zod';
import catchAsync from '../../util/server/catchAsync';

/**
 * Middleware to purify and validate the request {body, cookies, query, params} using multiple Zod schemas.
 *
 * This middleware validates the request against all provided Zod schemas.
 * The validated and merged data is then assigned back to `req`.
 * If validation fails, an error is thrown and handled by `catchAsync`.
 *
 * @param {...AnyZodObject} schemas - The Zod schemas to validate the request against.
 * @return Middleware function to purify the request.
 */
const purifyRequest = (...schemas: AnyZodObject[]) =>
  catchAsync(async (req, _, next) => {
    const results = await Promise.all(
      schemas.map(schema => schema.parseAsync(req)),
    );

    req.body = Object.assign({}, req.body, ...results.map(r => r.body));
    req.query = Object.assign({}, req.query, ...results.map(r => r.query));
    req.params = Object.assign({}, req.params, ...results.map(r => r.params));
    req.cookies = Object.assign(
      {},
      req.cookies,
      ...results.map(r => r.cookies),
    );

    next();
  });

export default purifyRequest;
