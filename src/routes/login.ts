import { Router } from 'express';
import { getLineLoginEndpoint, lineLogin, login } from '../services/login';
import { AuthMiddleware } from '../middlewares/Auth';
import BodyValidator from '../middlewares/BodyValidator';
import { SignInRequest } from '../models/request/login';
import { BadRequestError } from '../utils/response';

const router = Router();

router.post('/', BodyValidator(SignInRequest), async (req, res) => {
  const { type, code } = req.body as SignInRequest;

  switch (type) {
    case 'LINE': {
      const jwtData = await lineLogin(code);
      const jwtToken = await login(jwtData);
      return res.json(jwtToken);
    }
    default: {
      throw new BadRequestError('Login type is invalid');
    }
  }
});

router.post('/authentication', AuthMiddleware, async (_, res) => {
  res.sendStatus(200);
});

router.get('/line', (_, res) => {
  res.send(getLineLoginEndpoint());
});

export const loginRouter = router;
