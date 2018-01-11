import {responses} from "../utils/helper";
export default async (ctx, next) => {
  try{
    if(!ctx.headers.authorization) ctx.throw(401);

    await next();
  }catch (err){
    ctx.body = responses[err.status];
  }
}
