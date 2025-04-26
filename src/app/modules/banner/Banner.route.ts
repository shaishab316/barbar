import { Router } from 'express';
import { BannerControllers } from './Banner.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Banner from './Banner.model';
import imageUploader from '../../middlewares/imageUploader';
import { BannerValidations } from './Banner.validation';

const admin = Router();

admin.get('/', BannerControllers.list);

admin.post(
  '/create',
  imageUploader({ fieldName: 'image', maxCount: 1 }),
  purifyRequest(BannerValidations.create),
  BannerControllers.create,
);

admin.delete(
  '/:bannerId/delete',
  purifyRequest(QueryValidations.exists('bannerId', Banner)),
  BannerControllers.delete,
);

export const BannerRoutes = {
  admin,
  user: Router().get('/', BannerControllers.retrieve),
};
