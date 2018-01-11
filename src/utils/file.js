import 'babel-polyfill';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import chunk from 'read-chunk';
import fileType from 'file-type';
import ffmpeg from 'fluent-ffmpeg';
import toPromise from 'es6-promisify';

import config from "../config";
import {responses} from "./helper";

class File {
  constructor() {
    return {
      save: this.save.bind(this),
      get: this.get.bind(this),
      info: this.info.bind(this)
    }
  }

  async save(file, type){
    const info = await this.info(file);
    let name = this._name();
    let thumb = name;
    let meta = {};

    if(config.storage.mime.image.indexOf(info.mime) === -1 && config.storage.mime.video.indexOf(info.mime) === -1) return responses[415];

    let buffer = false;

    if(config.storage.mime.image.indexOf(info.mime) !== -1){
      info.type = 'image';
      name = name + '.jpeg';
      thumb = name;
      const saved = await this._saveImage(file, name, type);
      meta = {
        mime: 'image/jpeg',
        size: saved.size,
        width: saved.width,
        height: saved.height
      }
    }

    if(config.storage.mime.video.indexOf(info.mime) !== -1){
      info.type = 'video';
      buffer = await this._saveVideo(file, name, type);
      const saved = await toPromise(buffer.ffprobe, buffer)();
      thumb = name + '.jpeg';
      name = name + '.mp4';
      meta = {
        mime: 'video/mp4',
        size: saved.format.size,
        width: saved.streams[0].width,
        height: saved.streams[0].height
      }
    }

    return {
      name: name,
      thumbnail: thumb,
      type: info.type,
      meta: meta
    }
  }

  async get(path) {
    if(fs.existsSync(path)) return await fs.createReadStream(path);
    return responses[404];
  }

  async info(file){
    const part = await chunk.sync(file.path, 0, 4000);
    return fileType(part);
  }

  _name(){
    return crypto.randomBytes(20).toString('hex');
  }

  _getPath(type){
    let savePath = path.join(config.storage.file.path, type);
    if(type == 'post') savePath = {
      display: path.join(savePath, 'display'),
      thumb: path.join(savePath, 'thumb')
    };
    return savePath;
  }

  async _saveImage(file, name, type){
    const savePath = this._getPath(type);
    const buffer = sharp(file.path);
    let newBuffer = false;
    if(typeof savePath.display !== 'undefined'){
      newBuffer = await buffer.jpeg({
        quality: 100
      }).toFile(path.join(savePath.display, name));

      await buffer.resize(500).jpeg({
        quality: 100
      }).toFile(path.join(savePath.thumb, name));
    }else{
      newBuffer = await buffer.toFile(path.join(savePath, name));
    }
    return newBuffer;
  }

  async _saveVideo(file, name){
    const savePath = this._getPath('post');
    return ffmpeg(file.path).format('mp4').screenshot({
      count: 1,
      folder: savePath.thumb,
      filename: `${name}.jpeg`,
      size: '500x?'
    }).output(path.join(savePath.display, name + '.mp4'));
  }

  async _saveS3(file, name){
    return {
      name: name
    }
  }

  async _save(file, name, type){
    if(config.storage.default === 'file'){
      return await this._saveFile(file, name, type);
    }
  }
}

export default new File();

