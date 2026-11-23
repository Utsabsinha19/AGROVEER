import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', ProductsController.getAll);
productsRouter.get('/categories', ProductsController.getCategories);
productsRouter.get('/:id', ProductsController.getById);

