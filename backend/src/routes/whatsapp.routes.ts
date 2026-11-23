import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller.js';

export const whatsappRouter = Router();

whatsappRouter.get('/templates', WhatsAppController.getTemplates);
whatsappRouter.post('/inquiry', WhatsAppController.createInquiry);
whatsappRouter.post('/send-hsm', WhatsAppController.sendHSM);
whatsappRouter.post('/webhook', WhatsAppController.webhook);

