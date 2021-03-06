/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import { ObjectId } from 'mongodb';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import { acceptorMiddlewares, secret,
  profileMiddlewares as profile, manageDpt, info } from '../config';
import { getToken } from '../utils';

const tryRun = (func) => {
  try {
    return func();
  } catch (e) {
    return null;
  }
};

// 获取当前用户的Id
const getId = req => req.user.UserId;

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
  // 判断是否是Supervisor或Manager，只有这两种角色可以查看列表
  (req, res, next) => {
    if (req.user.isManager || req.user.isSupervisor) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager or supervisor can go next.' });
  },
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
  // 判断是否是Supervisor或Manager，只有这两种角色可以查看列表
  (req, res, next) => {
    if (req.user.isManager || req.user.isSupervisor) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager or supervisor can go next.' });
  },
  acceptorMiddlewares.getById(
      req => (new ObjectId(req.params.id)),
  ),
);

router.put('/',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  // 检查证件号码是否已在
  acceptorMiddlewares.findOneByIdCardNumber(
    req => req.body.idCard ? req.body.idCard.number : null,
    (acceptor, req, res, next) => {
      if (acceptor) {
        res.send({
          ret: OBJECT_ALREADY_EXISTS,
          msg: `证件号码为${acceptor.idCard.number}的数据已存在`,
        });
      } else next();
    },
  ),
  // 在acceptor中添加数据
  acceptorMiddlewares.insert(
    // acceptor中的数据
    req => req.body,
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.delete('/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  // 在acceptor中删除
  acceptorMiddlewares.removeById(
    // getId
    req => tryRun(() => new ObjectId(req.params.id)),
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.put('/edu/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),

  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
 acceptorMiddlewares.addEdu(
   req => tryRun(() => new ObjectId(req.params.id)),
   req => tryRun(() => ({
     name: req.body.name,
     year: parseInt(req.body.year, 10),
     degree: req.body.degree,
   })),
   (result, req, res) => res.send({ ret: SUCCESS }),
 ),
);

// 判断是否是Manager，只有这种角色可以修改数据
const onlyManagerCanGoNext = (req, res, next) => {
  if (req.user.isManager) next();
  else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
};
// 确保用户已登录
const ensureUserLogged = expressJwt({
  secret,
  credentialsRequired: true,
  getToken,
});

router.delete('/edu/:id',
  // 确保用户已登录
  ensureUserLogged,
  // 判断是否是Manager，只有这种角色可以修改数据
  onlyManagerCanGoNext,
  acceptorMiddlewares.removeEdu(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

// 与上一个route相同功能，目的是满足aliyun api网关的要求
router.post('/edu/remove/:id',
  // 确保用户已登录
  ensureUserLogged,
  // 判断是否是Manager，只有这种角色可以修改数据
  onlyManagerCanGoNext,
  acceptorMiddlewares.removeEdu(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.put('/career/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  acceptorMiddlewares.addCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.delete('/career/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  acceptorMiddlewares.removeCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

// 与上一个route相同功能，目的是满足aliyun api网关的要求
router.post('/career/remove/:id',
  // 确保用户已登录
  ensureUserLogged,
  // 判断是否是Manager，只有这种角色可以修改数据
  onlyManagerCanGoNext,
  acceptorMiddlewares.removeCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.put('/record/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  acceptorMiddlewares.addRecord(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      ...req.body,
      project: req.body.project,
      amount: parseFloat(req.body.amount, 10),
      date: isNaN(Date.parse(req.body.date)) ? new Date() : new Date(req.body.date),
    })),
    (recordId, req, res) => res.send({ ret: SUCCESS, data: recordId }),
  ),
);

router.delete('/record/:id/:recordId',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  acceptorMiddlewares.removeRecord(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => new ObjectId(req.params.recordId)),
    (recordId, req, res) => res.send({ ret: SUCCESS, data: recordId }),
  ),
);

router.post('/:id',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  // 判断是否是Manager，只有这种角色可以修改数据
  (req, res, next) => {
    if (req.user.isManager) next();
    else res.send({ ret: UNAUTHORIZED, msg: 'only manager can go next.' });
  },
  // 执行更新操作
  acceptorMiddlewares.updateById(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.body,
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

export default router;
