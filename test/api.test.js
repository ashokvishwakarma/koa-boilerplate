/* eslint-disable */

import supertest from 'supertest'
import { expect, should } from 'chai';

import app from '../src/';

const temp = {};
const request = supertest.agent(app.listen());
should();
