import { Router } from 'express';
import { CreateUserController } from './controllers/CreateUserController';
import { CreateTagController } from './controllers/CreateTagController';
import { ensureAdmin } from './middlewares/ensureAdmin';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateComplimentController } from './controllers/CreateComplimentController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { ListUserSendComplimentsController } from './controllers/ListUserSendComplimentsController';
import { ListUserReceiveComplimentsController } from './controllers/ListUserReceiveComplimentsController';
import { ListTagsController } from './controllers/ListTagsController';
import { ListUsersController } from './controllers/ListUsersController';

const routes = Router();

const createUserController = new CreateUserController();
const createTagController = new CreateTagController();
const authenticateUserController = new AuthenticateUserController();
const createComplimentController = new CreateComplimentController();
const listUserSendComplimentsController =new ListUserSendComplimentsController();
const listUserReceiveComplimentsController = new ListUserReceiveComplimentsController();

const listTagsController = new ListTagsController();

const listUsersController = new ListUsersController();

routes
  .post('/tags', ensureAuthenticated, ensureAdmin, createTagController.handle)
  .get('/tags', ensureAuthenticated, listTagsController.handle)
  .post('/users', createUserController.handle)
  .post('/login', authenticateUserController.handle)
  .post('/compliments', ensureAuthenticated, createComplimentController.handle)
  .get('/users/compliments/send', ensureAuthenticated, listUserSendComplimentsController.handle)
  .get('/users/compliments/receive', ensureAuthenticated, listUserReceiveComplimentsController.handle)
  .get('/users', ensureAuthenticated, listUsersController.handle);

export { routes };
