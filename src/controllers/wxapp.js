import { Router } from 'express';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import WXBizDataCrypt from './WXBizDataCrypt';

const router = new Router();

router.post('/decrypt',
  (req, res) => {
    const { appId, sessionKey, encryptedData, iv } = req.body;
    const pc = new WXBizDataCrypt(appId, sessionKey);
    const data = pc.decryptData(encryptedData, iv);
    res.json({
      ret: SUCCESS,
      data,
    });
  }
);

export default router;
