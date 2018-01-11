import 'babel-polyfill';
import User from '../models/User';
import Session from '../utils/session';

import {errorMessages} from "../utils/helper";

class AuthController {

  constructor(){
    return {
      check: this.check.bind(this),
      register: this.register.bind(this),
      login: this.login.bind(this),
      facebook: this.facebook.bind(this),
      google: this.google.bind(this)
    }
  }

  async check(ctx) {
    const user = await User.findOne({ email: ctx.request.body.email });
    if (user) {
      ctx.body = { status: 'success', registered: true, user };
    } else {
      ctx.body = { status: 'failed', registered: false, user: null };
    }
  }

  async register(ctx) {
    let user = await User.findOne({email: ctx.request.body.email});
    let resp = {};
    if(user) {
      resp = { status: 'success', existing: true, user };
    }else{
      user = await User.create(ctx.request.body);
      resp = { status: 'success', existing: false, user };
    }

    resp._token = await Session.set(user);
    ctx.body = resp;
  }

  async login(ctx) {
    const user = await User.findOne({
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    });

    if (user) {
      const token = await Session.set(user);
      ctx.body = { status: 'success', user, _token: token }
    }else{
      ctx.body = {
        status: "failed",
        message: errorMessages.INVALID_LOGIN
      };
    }
  }

  async facebook(ctx) {
    ctx.body = await this._social('facebook', ctx.request.body);
  }

  async google(ctx) {
    ctx.body = await this._social('google', ctx.request.body);
  }

  // private method
  async _social(type, data) {
    let user = await User.findOne({ email: data.email });
    let res = {status: 'success', type: 'social', client: type,};

    if (user) {
      res.registered = true;
      res.user = user;
    } else {
      user = await User.create(data);
      res.registered = false;
      res.user = user;
    }
    res._token = await Session.set(user);
    return res;
  }
}

export default new AuthController();
