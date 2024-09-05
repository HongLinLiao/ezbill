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
  mongodbConnection: string;
}

export const Env: IEnv = {
  env: process.env.ENV as ENV,
  port: Number(process.env.PORT),
  mongodbConnection: process.env.MONGODB_CONNECTION ?? '',
};
