import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { Env } from './utils/env';
import { initMongoDB } from './utils/mongo';
import { loginRouter } from './routes/login';
import { ErrorMiddleware } from './middlewares/Error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

initMongoDB();

app.get('/', (_, res) => {
  res.sendStatus(200);
});
app.use('/login', loginRouter);

app.use(ErrorMiddleware);

app.listen(Env.port, () => {
  console.log(
    `🚀 ${Env.env} Server is running at http://localhost:${Env.port}`,
  );
});
