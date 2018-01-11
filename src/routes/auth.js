import 'babel-polyfill';
import Router from 'koa-router';

import config from '../config';
import AuthController from '../controllers/AuthController';

const api = 'auth';
const router = new Router({prefix: `/${config.api.version}/${api}`});

router.post('/check', AuthController.check)
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .post('/facebook', AuthController.facebook)
  .post('/google', AuthController.google);

export default router;
