import env from '../utils/env';

const app = {
  host: env('HOST', '0.0.0.0'),
  port: env('PORT', 4000),
  name: 'parivartan-api'
};

export default app;
