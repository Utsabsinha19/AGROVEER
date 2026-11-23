import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller.js';

export const ordersRouter = Router();

ordersRouter.post('/', OrdersController.create);
ordersRouter.post('/create', OrdersController.create);
ordersRouter.get('/', OrdersController.list);
ordersRouter.get('/:id', OrdersController.getById);
ordersRouter.patch('/:id/status', OrdersController.updateStatus);
