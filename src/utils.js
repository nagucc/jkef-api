import { mockVersion } from './config';

/*
从request中获取jwt
 */
export const getToken = (req) => {
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return '';
};

export const isMockVersion = (req) => {
  const header = 'x-app-version';
  const version = req.get(header);
  return version === mockVersion;
};

export default {
  getToken,
  isMockVersion,
};
