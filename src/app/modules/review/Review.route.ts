import { Router } from 'express';
import { ReviewControllers } from './Review.controller';
import { ReviewValidations } from './Review.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Salon from '../salon/Salon.model';

/** User Routes */
const user = Router();

user.delete(
  '/:reviewId/delete',
  purifyRequest(QueryValidations.exists('reviewId', Salon)),
  ReviewControllers.delete,
);

/** Admin Routes */
const admin = Router();

admin.get(
  '/',
  purifyRequest(QueryValidations.list, ReviewValidations.list),
  ReviewControllers.list,
);

/** Salon Routes */
const salon = Router();

salon.get(
  '/:salonId/reviews',
  purifyRequest(
    QueryValidations.exists('salonId', Salon),
    QueryValidations.list,
  ),
  ReviewControllers.retrieve,
);

salon.patch(
  '/:salonId/review',
  purifyRequest(
    QueryValidations.exists('salonId', Salon),
    ReviewValidations.store,
  ),
  ReviewControllers.store,
);

export const ReviewRoutes = {
  user,
  salon,
  admin,
};
