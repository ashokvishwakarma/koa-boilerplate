export function id(){
  return Math.random().toString(13).replace('0.', '')
}


export const responses = {
  200: {
    type: 'success',
    code: 200,
    status: 'ok',
    message: 'The request has succeeded.'
  },
  204: {
    type: 'success',
    code: 204,
    status: 'No Content',
    message: 'No response body to send.'
  },
  400: {
    type: 'error',
    code: 400,
    status: 'Bad Request',
  },
  401: {
    type: 'error',
    code: 401,
    status: 'Unauthorized',
    message: 'Authentication credentials are missing or invalid.'
  },
  403: {
    type: 'error',
    code: 403,
    status: 'Forbidden',
    message: 'The server understood the request but refuses to authorize it.'
  },
  404: {
    type: 'error',
    code: 404,
    status: 'Not Found',
    message: 'The requested URL or Resource is not found.'
  },
  405: {
    type: 'error',
    code: 405,
    status: 'Method Not Allowed',
    message: 'The requested method is not allowed.'
  },
  406:{
    type: 'error',
    code: 406,
    status: 'Not Acceptable',
    message: 'The request has missing file.'
  },
  415: {
    type: 'error',
    code: 415,
    status: 'Unsupported Media Type',
    message: 'The supported media types are JPG,JPEG,PNG.'
  },
  500: {
    type: 'error',
    code: 500,
    status: 'Internal Server Error',
    message: 'The server encountered an unexpected condition that prevented it from fulfilling the request.'
  }
};

export const errorMessages = {
  MISSING: "One or more required parameters are missing.",
  INVALID_LOGIN: "Invalid login credentials.",
  INVALID_TOKEN: "Invalid or expired authorization token."
}

export const pagination = {
  per_page: 15
}

export function getExtraUrls(ctx){
  const pathname = ctx.req._parsedUrl.pathname;
  const query = ctx.req._parsedUrl.query || "page=1";
  const ret = {
    current: pathname
  };

  if(query){
    ret.current += '?' + query;
  }

  if(ctx.body.total > (ctx.body.limit + ctx.body.offset)){
    ret.next = pathname + '?' + query.replace(new RegExp('\page=[0-9]+'), 'page=' + (parseInt(ctx.query.page || 1) + 1))
  }

  if(ctx.query.page > 1){
    ret.previous = pathname + '?' + query.replace(new RegExp('\page=[0-9]+'), 'page=' + (parseInt(ctx.query.page) - 1))
  }

  return ret;
}

export function isValidMongoDBObjectId(str){
  return str.length === 24 && /^[a-f\d]{24}$/i.test(str)
}

export function handleValidationError(err){
  return {
    type: 'error',
    message: err.message
  }
}

export function getModelFromUrl(url){
  if(url.indexOf("?") !== -1) url = url.split("?")[0]
  const model = url.split('/')[3];
  return model;
}

const time = function (start) {
  const delta = Date.now() - start;
  return (delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's');
};

export function logInfo(start, ctx, logger){
  const res = ctx.res;

  const onFinish = done.bind(null, 'finish');
  const onClose = done.bind(null, 'finish');

  res.once('finish', onFinish);
  res.once('close', onClose);

  function done(event) {
    res.removeListener('finish', onFinish);
    res.removeListener('close', onClose);

    const resp = responses[ctx.status];

    const upstream = resp.type == "error" ? 'xxx' : event === 'close' ? '-x-' : '-->';
    logger.info(`${upstream} ${ctx.method} ${ctx.originalUrl} ${ctx.status} ${time(start)}`);
  }
}
