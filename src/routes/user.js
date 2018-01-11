import 'babel-polyfill';
import Router from 'koa-router';

import config from '../config';
import params from '../middlewares/params';
import UserController from '../controllers/UserController';

const api = 'user';
const router = new Router({prefix:`/${config.api.version}/${api}`});

router.get('/', params, UserController.find)
  .post('/', UserController.save)
  .delete('/', UserController.delete)
  .get('/:id', UserController.findOne)
  .post('/:id', UserController.save)
  .delete('/:id', UserController.delete);

export default router;
