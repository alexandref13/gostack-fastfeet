import express from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

const routes = express.Router();
const uploads = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:recipient_id', RecipientController.show);
routes.put('/recipients/:recipient_id', RecipientController.update);
routes.delete('/recipients/:recipient_id', RecipientController.delete);

routes.post('/files', uploads.single('file'), FileController.store);
routes.get('/files', FileController.index);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliveryman/:deliveryman_id', DeliverymanController.delete);

export default routes;
