/*
 eslint-disable no-param-reassign, no-underscore-dangle
*/

import { Router } from 'express';
import { ObjectId } from 'mongodb';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED, SERVER_FAILED } from 'nagu-validates';
import { secret, mongoUrl } from '../config';
import { getToken } from '../utils';

const EntityManager = require('../models/entity-manager').default;

// const cim = new EntityManager(mongoUrl);
const router = new Router();

// 添加新entity到数据库中
router.put('/:name',
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
    const entityName = req.params.name;
    const em = new EntityManager(mongoUrl, entityName);
    const _id = await em.insert(req.body);
    res.json({
      ret: SUCCESS,
      data: { _id },
    });
  }
);

// 获取数据列表
router.get('/:name/list/:pageIndex',
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
  (req, res, next) => {
    req.pageIndex = parseInt(req.params.pageIndex, 10);
    req.pageSize = parseInt(req.query.pageSize || 200, 10);
    if (isNaN(req.pageIndex) || isNaN(req.pageSize)) throw new Error('pageIndex or pageSize is wrong.');
    next();
  },
  async (req, res) => {
    const entityName = req.params.name;
    const em = new EntityManager(mongoUrl, entityName);
    const list = await em.list({
      pageSize: req.pageSize,
      pageIndex: req.pageIndex,
    });
    const totalCount = await em.count();
    res.json({
      ret: SUCCESS,
      data: {
        list,
        totalCount,
      },
    });
  }
);

// 根据用户信息获取录取信息
router.get('/:name/:id',
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
    const { name, id } = req.params;
    const em = new EntityManager(mongoUrl, name);
    const data = await em.findById(new ObjectId(id));
    res.json({
      ret: SUCCESS,
      data,
    });
  }
);

// 删除指定Id的数据
router.delete('/:name/:id',
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
    try {
      const { name, id } = req.params;
      const em = new EntityManager(mongoUrl, name);
      const _id = new ObjectId(id);
      await em.removeById(_id);
      res.json({
        ret: SUCCESS,
      });
    } catch (e) {
      res.status(500).json({
        ret: SERVER_FAILED,
        msg: e.message,
      });
    }
  }
);

router.post('/:name/:id',
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
    try {
      const { name, id } = req.params;
      const em = new EntityManager(mongoUrl, name);
      const _id = new ObjectId(id);
      await em.updateById({
        ...req.body,
        _id,
      });
      res.json({
        ret: SUCCESS,
        data: {
          _id,
        },
      });
    } catch (e) {
      res.status(500).json({
        ret: SERVER_FAILED,
        msg: e.message,
      });
    }
  }
);
export default router;
