import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { BannerRoutes } from '../banner/Banner.route';
import { CategoryRoutes } from '../category/Category.route';
import { OtpRoutes } from '../otp/Otp.route';
import { ReviewRoutes } from '../review/Review.route';

const routes: TRoute[] = [
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/banners',
    route: BannerRoutes.admin,
  },
  {
    path: '/categories',
    route: CategoryRoutes.admin,
  },
  {
    path: '/otps',
    route: OtpRoutes.admin,
  },
  {
    path: '/reviews',
    route: ReviewRoutes.admin,
  },
];

export default Router().inject(routes);
