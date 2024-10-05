import jwt from 'jsonwebtoken';

import { Env } from './env';
import { LoginType } from '../enums/LoginType';

const expiresIn = '7d';
const issuer = `ezbill-${Env.env}`;

export function issueToken(data: JwtAttachment): string {
  const { jwtSecret } = Env;
  return jwt.sign(data, jwtSecret, { expiresIn, issuer });
}

export function verifyToken(token: string): JWT {
  const { jwtSecret } = Env;
  return jwt.verify(token, jwtSecret, { issuer }) as JWT;
}

export interface ThirdPartyJwt {
  uid: string;
  userName: string;
  avatar?: string;
  loginType: LoginType;
  email: string;
}

export interface JwtAttachment extends ThirdPartyJwt {
  thirdPartyUid?: string;
}

export interface JWT extends JwtAttachment {
  iat: number;
  exp: number;
  iss: string;
}
