/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
// import { ObjectId } from 'mongodb';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import { secret, info, mongoUrl } from '../config';
import { getToken } from '../utils';
const CeeInfoManager = require('../models/cee').default;

const cim = new CeeInfoManager(mongoUrl);
const router = new Router();

router.put('/',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以添加数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  async (req, res) => {
    console.log(req.body);
    const _id = await cim.insert(req.body);
    res.json({
      ret: SUCCESS,
      data: { _id },
    });
  }
);

router.get('/',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以读取列表
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  async (req, res) => {
    const list = await cim.list();
    const totalCount = await cim.count();
    res.json({
      ret: SUCCESS,
      data: {
        list,
        totalCount,
      },
    });
  }
);

export default router;
