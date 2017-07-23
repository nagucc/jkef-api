import debug from 'debug';
import { AcceptorMiddlewares, StatMiddlewares } from 'acceptor-middlewares';
import { MongoProfileMiddlewares, MongoProfile } from 'nagu-profile';
import AcceptorManager from 'jkef-model';

// debug
export const error = debug('jkef-api:error');
export const info = debug('jkef-api:info');

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const cookieKey = process.env.COOKIE_KEY || 'my cookie key';

// Mongodb 数据库服务器Url
export const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/jkef';

// Middlewares
export const acceptorMiddlewares = new AcceptorMiddlewares(mongoUrl, 'acceptors');
export const statMiddlewares = new StatMiddlewares(mongoUrl, 'acceptors');

export const secret = process.env.SECRET || 'my secret';

export const amqpUrl = process.env.AMQP_URL || '';
export const requestQueueName = process.env.AMQP_REQUEST_QUEUE_NAME || 'api-request';

export const profileCollection = process.env.PROFILE_COLLECTION || 'profiles';
export const profileManager = new MongoProfile(mongoUrl, profileCollection);
export const profileMiddlewares = new MongoProfileMiddlewares(mongoUrl, profileCollection);

export const acceptorManager = new AcceptorManager(mongoUrl, 'acceptors');

// 用于受赠者统计的cron字符串,默认为2分钟统计一次。
export const statCron = process.env.ACCEPTORS_STAT_CRON || '00 */2 * * * *';

export const manageDpt = parseInt(process.env.MANAGER_DEPT || '13', 10);
export const supervisorDpt = parseInt(process.env.SUPERVISOR_DEPT || '14', 10);

export const mockVersion = process.env.MOCK_VERSION || '0.0.0';

// 腾讯COS配置
export const cos = {
  AppId: process.env.COS_APPID,
  SecretId: process.env.COS_SECRETID,
  SecretKey: process.env.COS_SECRETKEY,
};
