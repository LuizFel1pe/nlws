import prismaClient from '../../config/prisma';
import axios from 'axios';
import { sign } from 'jsonwebtoken';

type AccessTokenResponse = {
  access_token: string;
};

type UserResponse = {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
};

export class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const {
      data: { access_token },
    } = await axios.post<AccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const response = await axios.get<UserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { login, avatar_url, id, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: { github_id: id },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: { github_id: id, login, name, avatar_url },
      });
    }

    const token = sign(
      {
        user: { id: user.id, name: user.name, avatar_url: user.avatar_url },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    return { token, user };
  }
}
