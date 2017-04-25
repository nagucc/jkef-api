import debug from 'debug';
import { AcceptorMiddlewares, StatMiddlewares } from 'acceptor-middlewares';
import { MongoProfileMiddlewares, MongoProfile } from 'nagu-profile';

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
