/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import { SUCCESS } from 'nagu-validates';
import { secret } from '../config';
import { getToken, isMockVersion } from '../utils';


const router = new Router();


router.get('/wxapp',
  // // 返回mock数据
  // (req, res, next) => {
  //   if (isMockVersion(req)) {
  //     const data = [{
  //       id: 'jkef-jxj',
  //       title: '升学考试录取信息填写',
  //       desc: '2017年度基金会奖学金发放工作即将开始，请您抓紧时间登记录取信息。',
  //       faClass: 'fa fa-gift fa-3x',
  //       url: '/pages/cee/registration/registration',
  //     }];
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
  async (req, res) => {
    res.json({
      ret: SUCCESS,
      data: [{
        id: 'jkef-jxj',
        title: '升学考试录取信息填写',
        desc: '2017年度基金会奖学金发放工作即将开始，请您抓紧时间登记录取信息。',
        faClass: 'fa fa-gift fa-3x',
        url: '/pages/cee/registration/registration',
      }],
    });
  }
);

export default router;
