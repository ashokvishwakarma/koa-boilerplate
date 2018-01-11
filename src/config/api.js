import env from '../utils/env';
import app from './app';

const api = {
  version: env('VERSION', 1.0),
  base: env('BASE', `http://${app.host}:${app.port}/`)
};

export default api;
