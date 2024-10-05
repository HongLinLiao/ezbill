import env from 'dotenv';
env.config();

enum ENV {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  PROD = 'PROD',
}

interface IEnv {
  env: ENV;
  port: number;
  lineClientId: string;
  lineClientSecret: string;
  lineRedirectUri: string;
  jwtSecret: string;
  mongodbConnection: string;
}

export const Env: IEnv = {
  env: process.env.ENV as ENV,
  port: Number(process.env.PORT),
  lineClientId: process.env.LINE_CLIENT_ID ?? '',
  lineClientSecret: process.env.LINE_CLIENT_SECRET ?? '',
  lineRedirectUri: process.env.LINE_REDIRECT_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  mongodbConnection: process.env.MONGODB_CONNECTION ?? '',
};
