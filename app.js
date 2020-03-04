import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import flash from 'connect-flash';
import routes from './routes';
import errorHandlers from './middleware/errorhandlers';
import log from './middleware/log';
import util from './middleware/utilities';
import config from './config';
import io from './socket.io';
import { passport, routes as passportRoutes } from './passport';

const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const app = express();

app.use(log.logger);
app.use(express.static(`${__dirname}/static`));
app.use(cookieParser(config.secret));
app.use(
  session({
    secret: config.secret,
    saveUninitialized: false,
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
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);

app.use((req, res, next) => {
  if (req.session.pageCount) req.session.pageCount += 1;
  else req.session.pageCount = 1;
  next();
});

app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.get(config.routes.logout, routes.logOut);
app.get(config.routes.register, routes.register);
app.post(config.routes.register, routes.registerProcess);
app.get('/chat', [util.requireAuthentication], routes.chat);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'));
});

passportRoutes(app);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

const server = app.listen(config.port, () => console.log(
  `Example app listening on port ${config.port}!`,
));
io.startIo(server);
