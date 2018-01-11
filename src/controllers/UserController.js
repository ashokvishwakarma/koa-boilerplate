import 'babel-polyfill';

import User from '../models/User';

class UserController {

  constructor() {
    return {
      find: this.find.bind(this),
      findOne: this.findOne.bind(this),
      save: this.save.bind(this),
      delete: this.delete.bind(this)
    }
  }

  // find all Users
  async find(ctx) {
    const user = await User.paginate(ctx.params.query, {offset: ctx.params.skip, limit: ctx.params.limit, sort: ctx.params.sort});
    ctx.body = user;
  }

  async findOne(ctx){
    const user = await User.findById(ctx.params.id);

    if(!user) return ctx.throw(404);

    ctx.body = user;
  }

  async save(ctx){
    let user = false;
    if(ctx.params.id){
      user = await User.findOneAndUpdate(ctx.params.id, ctx.request.body, {new: true});
    }else{
      user = await User.create(ctx.request.body);
    }
    ctx.body = user;
  }

  async delete(ctx){
    let user = false;

    if(ctx.params.id){
      user = await User.findByIdAndRemove(ctx.params.id);
    }else{
      user = await User.remove({ _id: { $in: ctx.request.body.ids }});
    }

    if(!user) return ctx.throw(404);

    if(user.result && user.result.ok) return ctx.body = {
      status: 'success',
      deleted: user.result.n,
      total: ctx.request.body.ids.length,
      ids: ctx.request.body.ids
    };

    if(ctx.params.id) return ctx.body = {
      status: 'success',
      id: user._id,
      message: "User " + user.first_name + " deleted"
    };

    ctx.body = {
      status: 'failure',
      message: 'Something went wrong, please try again.'
    }
  }
}
export default new UserController();
