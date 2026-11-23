import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller.js';

export const warehouseRouter = Router();

warehouseRouter.post('/scan-serial', WarehouseController.scanSerial);
warehouseRouter.post('/dispatch', WarehouseController.dispatch);
warehouseRouter.get('/pick-list/:orderId', WarehouseController.getPickList);

