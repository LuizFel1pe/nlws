import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { routes } from './routes';
import catchAllErrors from './middlewares/catchAllErrors';

import './database';

const app = express();
app.use(cors());

app.use(express.json());

app.use(routes);

app.use(catchAllErrors);

app.listen(3333, () => console.log('Server is running on port 3333!'));
