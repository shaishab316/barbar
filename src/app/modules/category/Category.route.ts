import { Router } from 'express';
import { CategoryControllers } from './Category.controller';
import { CategoryValidations } from './Category.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Category from './Category.model';
import capture from '../../middlewares/capture';

const admin = Router();

admin.post(
  '/create',
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 500 }],
  }),
  purifyRequest(CategoryValidations.create),
  CategoryControllers.create,
);

admin.patch(
  '/:categoryId/edit',
  purifyRequest(QueryValidations.exists('categoryId', Category)),
  capture({
    fields: [{ name: 'banner', maxCount: 1, width: 500 }],
  }),
  purifyRequest(CategoryValidations.edit),
  CategoryControllers.edit,
);

admin.delete(
  '/:categoryId/delete',
  purifyRequest(QueryValidations.exists('categoryId', Category)),
  CategoryControllers.delete,
);

export const CategoryRoutes = {
  admin,
  host: Router().get(
    '/',
    purifyRequest(QueryValidations.list),
    CategoryControllers.list,
  ),
};
