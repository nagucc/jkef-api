const { Router } = require('express');
const fetch = require('node-fetch');

const router = new Router();

router.get('/jscode2session',
  async (req, res) => {
    const { appId, secret, code } = req.query;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    const result = await fetch(url);
    res.json(await result.json());
  }
);

export default router;
