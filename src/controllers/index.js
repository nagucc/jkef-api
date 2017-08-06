import stat from './stat';
import acceptors from './acceptors';
import wxapp from './wxapp';

const cee = require('./cee').default;
const uir = require('./user-in-role').default;
const events = require('./events').default;
const weixin = require('./weixin').default;
const files = require('./files').default;
const entities = require('./entities').default;

export default {
  stat,
  acceptors,
  wxapp,
  cee,
  uir,
  events,
  weixin,
  files,
  entities,
};
