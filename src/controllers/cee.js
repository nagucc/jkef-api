/*
 eslint-disable no-param-reassign, no-underscore-dangle
*/

import { Router } from 'express';
import { ObjectId } from 'mongodb';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED, SERVER_FAILED } from 'nagu-validates';
import { secret, mongoUrl } from '../config';
import { getToken, isMockVersion } from '../utils';
import CeeInfoManager from '../models/cee';


const cim = new CeeInfoManager(mongoUrl);
const router = new Router();

router.put('/',
    // // 返回mock数据
    // (req, res, next) => {
    //   if (isMockVersion(req)) {
    //     res.json({
    //       ret: SUCCESS,
    //       data: {
    //         _id: '592e61700000000000000000',
    //       },
    //     });
    //   } else next();
    // },
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
    const _id = await cim.insert(req.body);
    res.json({
      ret: SUCCESS,
      data: { _id },
    });
  }
);

router.get('/list/:pageIndex',
  // // 返回mock数据
  // (req, res, next) => {
  //   if (isMockVersion(req)) {
  //     const list = [{
  //       name: '张三',
  //       fromSchool: '通海一中',
  //       toSchool: '玉溪一中',
  //       parentName: '张二',
  //       homeAddress: '纳古纳家营二组',
  //       phone: '18909879987',
  //       examTypeText: '中考',
  //       point: 536,
  //     }];
  //     res.json({
  //       ret: SUCCESS,
  //       data: {
  //         list,
  //         totalCount: list.length,
  //       },
  //     });
  //   } else next();
  // },
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
    const list = await cim.list({
      pageSize: req.pageSize,
      pageIndex: req.pageIndex,
    });
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

// 根据用户信息获取录取信息
router.get('/app/:appId/user/:userId',
  // // 返回mock数据
  // (req, res, next) => {
  //   if (isMockVersion(req)) {
  //     const data = {
  //       _id: '592e61700000000000000000',
  //       name: '张三',
  //       fromSchool: '通海一中',
  //       toSchool: '玉溪一中',
  //       parentName: '张二',
  //       homeAddress: '纳古纳家营二组',
  //       phone: '18909879987',
  //       examTypeText: '中考',
  //       examType: 4,
  //       point: 536,
  //       user: {
  //         [req.params.appId]: req.params.userId,
  //       },
  //     };
  //     res.json({
  //       ret: SUCCESS,
  //       data,
  //     });
  //   } else next();
  // },
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
    const { appId, userId } = req.params;
    const data = await cim.findByUser(appId, userId);
    res.json({
      ret: SUCCESS,
      data,
    });
  }
);

// 删除指定Id的数据
router.delete('/:id',
  // // 返回mock数据
  // (req, res, next) => {
  //   if (isMockVersion(req)) {
  //     res.json({
  //       ret: SUCCESS,
  //     });
  //   } else next();
  // },
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
    const { id } = req.params;
    try {
      const _id = new ObjectId(id);
      await cim.removeById(_id);
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

router.post('/:id',
  // // 返回mock数据
  // (req, res, next) => {
  //   if (isMockVersion(req)) {
  //     res.json({
  //       ret: SUCCESS,
  //       data: {
  //         _id: '592e61700000000000000000',
  //       },
  //     });
  //   } else next();
  // },
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
    const { id } = req.params;
    try {
      const _id = new ObjectId(id);
      await cim.updateById({
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
