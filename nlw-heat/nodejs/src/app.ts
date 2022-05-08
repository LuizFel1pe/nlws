import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import routes from './app/routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const httpServer = http.createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log(socket.id);
});

export { httpServer, io };
