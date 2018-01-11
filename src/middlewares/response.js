import {responses, getExtraUrls, isValidMongoDBObjectId, logInfo} from "../utils/helper";
import Session from '../utils/session';
import logger from '../utils/logger';



export default async (ctx, next) => {
  try {

    const start = new Date();

    if (ctx.headers.authorization && ctx.headers.authorization !== 'Bearer undefined') {
      const user = await Session.get(ctx.headers.authorization.replace("Bearer ", ""));
      if (user) ctx.user = JSON.parse(user);
    }

    await next();

    logInfo(start, ctx, logger);

    if (ctx.body && ctx.body['type'] === 'error') return ctx.body;

    const res = {http: responses[ctx.status]};

    if (ctx.body && ctx.body.docs) {
      res.data = ctx.body.docs;
      res.meta = {
        total: ctx.body.total,
        limit: ctx.body.limit,
        skipped: ctx.body.offset,
        page: ctx.query.page || 1,
        urls: getExtraUrls(ctx)
      }
    } else {
      res.data = ctx.body;
    }

    ctx.body = res;
  } catch (err) {

    console.log(err);

    logger.error(err);

    const resp = {
      status: 400,
      body: responses[400]
    };

    if (err.name && !ctx.params) {
      resp.status = 400;
      const res = responses[resp.status];
      res.message = err.message;
      resp.body = res;
    } else if (err.name && ctx.params && ctx.params.id && !isValidMongoDBObjectId(ctx.params.id)) {
      resp.status = 404;
      resp.body = responses[resp.status];
    } else {
      resp.status = (err.status && typeof err.status === 'number') ? err.status : 500;
      resp.body = responses[resp.status];
    }

    ctx.status = resp.status;
    ctx.body = resp.body
  }
}
