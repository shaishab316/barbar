import { Router } from 'express';
import { SalonControllers } from './Salon.controller';

const router = Router();

router.post('/create', SalonControllers.create);

export const SalonRoutes = router;
