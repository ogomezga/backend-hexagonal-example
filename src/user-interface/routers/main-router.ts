import express from 'express';
import { Dependencies } from '../../container';
import { handleRoute } from '../../infrastructure/http';

export default function makeMainRouter({ mainController, talkRouter }: Dependencies) {
  const router = express.Router();
  router.get('/', handleRoute(mainController.index));
  router.use('/talks', talkRouter);
  return router;
};
