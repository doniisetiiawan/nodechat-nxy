import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import flash from 'connect-flash';
import {
  index,
  login,
  logOut,
  register,
  registerProcess,
  chat,
} from './routes';
import {
  error,
  notFound,
} from './middleware/errorhandlers';
import { logger } from './middleware/log';
import * as util from './middleware/utilities';
import config from './config';
import startIo from './socket.io';
import {
  passport,
  routes as passportRoutes,
} from './passport';

const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const app = express();

app.use(logger);
app.use(express.static(`${__dirname}/static`));
app.use(cookieParser(config.secret));
app.use(
  session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({ client: redisClient }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf());
app.use(util.csrf);
// app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);

app.get('/', index);
app.get(config.routes.login, login);
app.get(config.routes.logout, logOut);
app.get(config.routes.register, register);
app.post(config.routes.register, registerProcess);
app.get('/chat', [util.requireAuthentication], chat);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'));
});

passportRoutes(app);

app.use(error);
app.use(notFound);

const server = app.listen(config.port, () => console.log(
  `Example app listening on port ${config.port}!`,
));
startIo(server);
