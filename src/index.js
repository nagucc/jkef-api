/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// import 'babel-polyfill';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { host, port, cookieKey } from './config';
import controllers from './controllers/index';
import { startJobs } from './jobs';

const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser(cookieKey));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const morgan = require('morgan');

app.use(morgan('dev'));

/*
注册API
*/
app.use('/upload', express.static('upload'));
app.use('/acceptors', controllers.acceptors);
app.use('/stat', controllers.stat);
app.use('/wxapp', controllers.wxapp);
app.use('/cee', controllers.cee);
app.use('/events', controllers.events);
app.use('/weixin', controllers.weixin);
app.use('/files', controllers.files);
app.use('/cos', controllers.cos);

// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') res.status(401).json({ ret: 401, msg: err.message });
  else res.status(500).json({ ret: -1, msg: err.message });
});
app.listen(port, () => {
  console.log(`The server is running at http://${host}/`); // eslint-disable-line
});

startJobs();
