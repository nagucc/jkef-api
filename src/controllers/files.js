import fs from 'fs';
import expressJwt from 'express-jwt';
import Busboy from 'busboy';
import { secret } from '../config';
import { getToken } from '../utils';

const { Router } = require('express');
const multer = require('multer');
const uuid = require('uuid/v4'); // 使用v4（random）生成uuid

// 确保upload和jkef目录存在
try {
  fs.accessSync('upload');
} catch (e) {
  fs.mkdirSync('upload');
}

try {
  fs.accessSync('upload/jkef');
} catch (e) {
  fs.mkdirSync('upload/jkef');
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('####,desdf');
    cb(null, 'upload/jkef');
  },
  filename(req, file, cb) {
    const extName = file.originalname.split('.').reverse()[0];
    console.log(`${uuid()}.${extName}`);
    cb(null, `${uuid()}.${extName}`);
  },
});


const upload = multer({ storage });


const router = new Router();


/*
上传文件。
参数列表：
- file 包含文件数据的字段

返回值：
{
    "fieldname": "file",
    "originalname": "jkef-logo.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "upload/jkef",
    "filename": "b4531220-7d78-11e7-ae7b-49b852160635.jpg",
    "path": "upload/jkef/b4531220-7d78-11e7-ae7b-49b852160635.jpg",
    "size": 56768
}
*/
router.post('/upload',
  // 确保用户已登录
  expressJwt({
    secret,
    credentialsRequired: true,
    getToken,
  }),
  (req, res, next) => {
    console.log('#############', req.get('Content-Type'));
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (field, file) => {
      console.log('6666666666');
      file.on('data', (data) => {
        res.send(`###${data.length}`);
      });
    });
    busboy.on('finish', () => {
      res.send('done');
    });
    req.pipe(busboy);
    // next();
  },
  // upload.single('file'),
  (req, res) => {
    console.log('### start');
    upload.single('file')(req, res, (err) => {
      console.log('errrrrr', err);
      if (err) {
        res.status(500).json({ ret: -1, msg: 'error' });
      } else {
        // console.log('####', req);
        res.json(Object.getOwnPropertyNames(req));
      }
    });
    // console.log(req);
    // res.json(req.file);
  }
);

export default router;
