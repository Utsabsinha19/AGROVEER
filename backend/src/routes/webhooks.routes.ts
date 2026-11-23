import { Router } from 'express';
import { WebhooksController } from '../controllers/webhooks.controller.js';

export const webhooksRouter = Router();

webhooksRouter.post('/payment', WebhooksController.handlePaymentWebhook);

