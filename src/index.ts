import express from 'express';

import { Env } from '@/utils/env';

const app = express();

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(Env.port, () => {
  console.log(
    `🚀 ${Env.env} Server is running at http://localhost:${Env.port}`,
  );
});
