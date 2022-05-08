import { Router } from 'express';
import { ensureAuthenticated } from '../../middleware/ensureAuthenticate';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import { CreateMessageController } from '../controllers/CreateMessageController';
import { GetLast3MessagesController } from '../controllers/GetLast3MessagesController';
import { ProfileUserController } from '../controllers/ProfileUserController';

const routes = Router();

routes
  .get('/github', (req, res) => {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
  })
  .get('/signin', (req, res) => {
    const { code } = req.query;

    return res.json(code);
  })
  .get('/messages/last3', new GetLast3MessagesController().handle)
  .get('/profile', ensureAuthenticated, new ProfileUserController().handle);

routes
  .post('/authenticate', new AuthenticateUserController().handle)
  .post('/messages', ensureAuthenticated, new CreateMessageController().handle);

export default routes;
