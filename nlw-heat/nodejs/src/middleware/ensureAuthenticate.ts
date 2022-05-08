import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

type Payload = {
  sub: string;
};

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: 'Token invalid',
    });
  }

  const [_, token] = authToken.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload;

    req.userId = sub;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'token expired ' });
  }
}

export { ensureAuthenticated };
