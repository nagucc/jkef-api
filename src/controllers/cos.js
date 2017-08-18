// 腾讯云对象存储

import crypto from 'crypto';
import { Router } from 'express';
import expressJwt from 'express-jwt';
import { cos, secret } from '../config';
import { getToken } from '../utils';

/*
计算请求签名(XML API)
文档：https://www.qcloud.com/document/product/436/7778
代码来自：https://github.com/tencentyun/cos-js-sdk-v5

参数：
- sid: AppId
- skey: Secret
- method: 请求method
- pathname: 请求url，以'/'开头
*/
const getXmlApiAuthorization = (sid, skey, method, pathname, callback) => {
  method = method || 'POST';
  method = method.toUpperCase();
  pathname = pathname || '/';
  pathname.substr(0, 1) != '/' && (pathname = `/${pathname}`);
  const queryParams = {};
  const headers = {};

  console.log(method, pathname);

        // 工具方法
  const getObjectKeys = function (obj) {
    const list = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        list.push(key);
      }
    }
    return list.sort();
  };
  const obj2str = function (obj) {
    let i,
      key,
      val;
    const list = [];
    const keyList = getObjectKeys(obj);
    for (i = 0; i < keyList.length; i++) {
      key = keyList[i];
      val = obj[key] || '';
      key = key.toLowerCase();
      key = encodeURIComponent(key);
      list.push(`${key}=${encodeURIComponent(val)}`);
    }
    return list.join('&');
  };

        // 签名有效起止时间
  const now = parseInt(new Date().getTime() / 1000) - 1;
  const expired = now + 600; // 签名过期时刻，600 秒后

        // 要用到的 Authorization 参数列表
  const qSignAlgorithm = 'sha1';
  const qAk = sid;
  const qSignTime = `${now};${expired}`;
  const qKeyTime = `${now};${expired}`;
  const qHeaderList = getObjectKeys(headers).join(';').toLowerCase();
  const qUrlParamList = getObjectKeys(queryParams).join(';').toLowerCase();

        // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
        // 步骤一：计算 SignKey
  const signKey = crypto.createHmac('sha1', skey).update(qKeyTime).digest('hex');

        // 步骤二：构成 FormatString
  const formatString = [method.toLowerCase(), pathname, obj2str(queryParams), obj2str(headers), ''].join('\n');

        // 步骤三：计算 StringToSign
  const stringToSign = ['sha1', qSignTime, crypto.createHash('sha1').update(formatString).digest('hex'), ''].join('\n');

        // 步骤四：计算 Signature
  const qSignature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');

        // 步骤五：构造 Authorization
  const authorization = [
    `q-sign-algorithm=${qSignAlgorithm}`,
    `q-ak=${qAk}`,
    `q-sign-time=${qSignTime}`,
    `q-key-time=${qKeyTime}`,
    `q-header-list=${qHeaderList}`,
    `q-url-param-list=${qUrlParamList}`,
    `q-signature=${qSignature}`,
  ].join('&');

  callback && callback(authorization);
  return authorization;
};

/*
计算请求签名（JSON API）
文档：https://www.qcloud.com/document/product/436/6054#.E7.AD.BE.E5.90.8D.E6.9C.89.E5.93.AA.E5.87.A0.E7.A7.8D.EF.BC.9F3
参数：
- appId
- sid
- skey
- bucket
- expire 过期时间，单位为秒，默认259200秒(30天), 单次请求签名时忽略此参数
- field 可选，生成单次请求签名是必须提供，默认为空字符串
- single 是否是单次请求签名，默认为false
*/
const getAppSign = (appId, sid, skey, bucket, expire = 259200, field = '', single = false) => {
  // 签名有效起止时间，当filed不为空时，代表单次签名，expired为0
  let expired = 0;
  const now = parseInt(new Date().getTime() / 1000, 10) - 1;
  if (!single) {
    expired = now + expire; // 签名过期时刻
  }

  // 生成随机整数
  const norce = 4455222;
  const original = `a=${appId}&b=${bucket}&k=${sid}&e=${expired}&t=${now}&r=${norce}&f=${field}`;
  console.log('original:', original);

  const signTmp = Buffer.concat([
    crypto.createHmac('sha1', skey).update(original).digest(),
    new Buffer(original),
  ]);
  const sign = signTmp.toString('base64');
  return sign;
};

const router = new Router();

/*
获取JSON API 的请求签名，过期时间为30天，多次请求签名
*/
router.get('/json-authorization',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  (req, res) => {
    res.send({
      ret: 0,
      data: getAppSign(cos.AppId, cos.SecretId, cos.SecretKey, cos.bucket),
    });
  }
);

export default router;
