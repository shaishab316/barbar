import { Router } from 'express';
import { BookmarkControllers } from './Bookmark.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Bookmark from './Bookmark.model';

const router = Router();

router.get('/', purifyRequest(QueryValidations.list), BookmarkControllers.list);

router.delete(
  '/:bookmarkId/delete',
  purifyRequest(QueryValidations.exists('bookmarkId', Bookmark)),
  BookmarkControllers.remove,
);

export const BookmarkRoutes = router;
