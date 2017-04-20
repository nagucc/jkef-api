/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import { ObjectId } from 'mongodb';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import { acceptorMiddlewares, secret, statMiddlewares } from '../config';
import { getToken } from '../utils';

const router = new Router();

router.get('/search/:text',
  // 1. 规整输入参数，并检查合法性
  // 2. 进行jwt验证
  // 3. 获取数据或其他操作
  // 4. 返回操作结果
  (req, res) => res.json({
    ret: 0,
    data: res.data,
  }),
);

router.get('/list/:pageIndex',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 获取数据
  acceptorMiddlewares.listByRecord(
    req => ({
      ...req.query,
      pageIndex: parseInt(req.params.pageIndex, 10),
      pageSize: parseInt(req.query.pageSize, 10),
    }),
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);


router.get('/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  acceptorMiddlewares.getById(
      req => (new ObjectId(req.params.id)),
  ),
);

router.get('/stat/by-project',
  statMiddlewares.getStatByProject(
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.get('/stat/by-year',
  statMiddlewares.getStatByYear(
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

export default router;
