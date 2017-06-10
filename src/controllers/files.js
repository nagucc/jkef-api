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


router.post('/upload',
  upload.single('file'),
  (req, res) => {
    res.json(req.file);
  }
);

export default router;
