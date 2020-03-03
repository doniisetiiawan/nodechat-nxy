const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const routes = require('./routes');
const errorHandlers = require('./middleware/errorhandlers');
const log = require('./middleware/log');
const util = require('./middleware/utilities');
const config = require('./config');
const io = require('./socket.io');
const passport = require('./passport');

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
app.use(passport.passport.initialize());
app.use(passport.passport.session());
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

passport.routes(app);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

const server = app.listen(config.port, () => console.log(
  `Example app listening on port ${config.port}!`,
));
io.startIo(server);
