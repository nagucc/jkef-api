/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import { mongoUrl, secret } from '../config';
import { getToken } from '../utils';
import UserInRole from '../models/user-in-role';

const uir = new UserInRole(mongoUrl);

const router = new Router();

// 根据appId获取用户列表
router.get('/users/app/:appId',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
    async (req, res) => {
      const { appId } = req.params;
      const users = await uir.usersByAppId(appId);
      res.json({
        ret: SUCCESS,
        data: users,
      });
    }
);

// 创建新用户，并设置角色
router.put('/users',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  async (req, res) => {
    const { appId, userId, role } = req.body;
    try {
      // 创建新用户
      const user = await uir.insertUser(appId, userId);
      // 设置角色
      if (role) await uir.addRole(appId, userId, role);

      res.json({
        ret: SUCCESS,
        data: {
          _id: user,
        },
      });
    } catch (e) {
      res.json({
        ret: -1,
        msg: e.message,
      });
    }
  }
);

export default router;
