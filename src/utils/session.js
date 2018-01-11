import jwt from 'jsonwebtoken';
import {createClient} from 'redis';
import crypto from 'crypto';
import toPromise from 'es6-promisify';

import config from '../config';
import {errorMessages} from './helper';
import logger from './logger';

class Session{
  constructor(){
    const redisOptions = {
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db
    };

    if(config.redis.password !== '') redisOptions.password = config.redis.password;

    const redis = createClient(redisOptions);

    redis.on("error", function (err) {
      logger.error(err);
    });

    this.generateBytes = toPromise(crypto.randomBytes, crypto);

    this.redis = {
      set: toPromise(redis.setex, redis),
      get: toPromise(redis.get, redis)
    };

    this.jwt = {
      sign: toPromise(jwt.sign, jwt),
      verify: toPromise(jwt.verify, jwt)
    };

    return {
      get: this.get.bind(this),
      set: this.set.bind(this)
    }
  }

  async _generateId(){
    try {
      const id = await this.generateBytes(32);
      return Promise.resolve(id.toString('hex'));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async get(token){
    try{
      const verify = await this.jwt.verify(token, config.session.secret);
      if(verify) return await this.redis.get(verify.id);
      return false;
    } catch (err){
      throw({message: errorMessages.INVALID_TOKEN, name: "Authorization Error"});
    }
  }

  async set(user){
    const id = await this._generateId();
    const tokenPayload = Object.assign({}, user.email, { id: id });
    const token = await this.jwt.sign(tokenPayload, config.session.secret);
    this.redis.set(id, config.session.age, JSON.stringify(user));
    return token;
  }
}

export default new Session();
