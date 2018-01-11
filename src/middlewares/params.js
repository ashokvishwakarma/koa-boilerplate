import {pagination} from "../utils/helper";

export default async (ctx, next) => {

  const operators = {
    '=': '$eq',
    '!=': '$ne',
    '<': '$lt',
    '>': '$gt',
    '<=': '$lte',
    '>=': '$gte',
  };

  const query = Object.keys(ctx.query);

  const params = {
    query:{},
    limit: pagination.per_page,
    sort: {
      added_on: -1
    },
    skip: 0
  };

  query.forEach((key) => {
    if(key == 'q'){
      params.query = {$or: [{first_name: ctx.query.q}, {last_name: ctx.query.q}]};
    }

    if(key === 'page'){
      params.skip = parseInt(params.limit * (ctx.query.page - 1));
    }

    if(key === 'sort'){
      const parts = ctx.query.sort.split(':');
      params.sort[parts[0]] = (parts[1] === 'ASC')?1:-1;
    }
  });

  ctx.params = params;
  await next();
}

