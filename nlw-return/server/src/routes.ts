import { Router } from 'express';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailerMailAdapter';

import { SubmitFeedback } from './functions/submitFeedback';
import { PrismaFeedbacksRepository } from './repositories/prisma/prismaFeedbacksRepository';

const routes = Router();

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
  const nodemailerAdapter = new NodemailerMailAdapter();

  const submitFeedback = new SubmitFeedback(
    prismaFeedbacksRepository,
    nodemailerAdapter
  );

  await submitFeedback.execute({ type, comment, screenshot });

  return res.status(201).send();
});

export default routes;
