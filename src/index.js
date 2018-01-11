/**
 * Index
 *
 * Entry point for koa-boilerplate application
 */
/**
 * Babel Polyfil
 *
 * Required for ES6
 */
import 'babel-polyfill';

/**
 * Koa
 * @npm https://www.npmjs.com/package/babel-polyfill
 */
import Koa from 'koa';

/**
 * Koa Body
 *
 * Koa Body parser
 * @npm https://www.npmjs.com/package/koa-body
 */
import body from 'koa-body'

/**
 * Koa2 Cors
 *
 * Required to handle cors requests
 * @npm https://www.npmjs.com/package/koa2-cors
 */
import cors from 'koa2-cors';

/**
 * Mongoose
 *
 * MongoDB database ORM
 * @npm https://www.npmjs.com/package/mongoose
 */
import mongoose from 'mongoose';

/**
 * Koa Helmet
 * @npm https://www.npmjs.com/package/koa-helmet
 */
import helmet from 'koa-helmet';

/**
 * Config
 *
 * Application configuration
 */
import config from './config';

/**
 * Routes
 *
 * Application Routes
 */
import router from './routes';

/**
 * Response
 *
 * Response middleware to handle request and response
 */
import response from './middlewares/response';

/**
 * Logger
 *
 * Application logger
 */
import logger from './utils/logger';

/**
 * Queue
 *
 * Application queue utility using Kue
 */
import Queue from './utils/queue';

/**
 * Mail
 *
 * Application mail utility using nodemailer
 */
import Mail from './utils/mail';

/**
 * app
 *
 * new Koa instance
 */
const app = new Koa();

mongoose.connect(config.database.uri, {
  useMongoClient: true,
});
mongoose.connection.on('error', console.error);

mongoose.Promise = global.Promise;

router(app);

app
  .use(body({multipart:true}))
  .use(helmet())
  .use(cors())
  .use(response);

app.on('error', (err) => {
  logger.error(err);
});

// Start the application
app.listen(config.app.port, config.app.host, () => {
  console.log(`🖥  Server started at http://0.0.0.0:${config.app.port}/`);
  logger.info(`Server started at http://0.0.0.0:${config.app.port}/`);
});

Queue.init();
Mail.init();


export default app;
