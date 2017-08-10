import expressJwt from 'express-jwt';
import { secret } from '../config';
import { getToken } from '../utils';

const { Router } = require('express');
const multer = require('multer');
const uuidV1 = require('uuid/v1');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload/jkef');
  },
  filename(req, file, cb) {
    const extName = file.originalname.split('.').reverse()[0];
    cb(null, `${uuidV1()}.${extName}`);
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
  upload.single('file'),
  (req, res) => {
    res.json(req.file);
  }
);

export default router;
