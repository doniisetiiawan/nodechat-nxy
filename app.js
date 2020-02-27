const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes');
const errorHandlers = require('./middleware/errorhandlers');
const log = require('./middleware/log');

const app = express();
const port = 3000;

app.use(log.logger);
app.use(express.static(`${__dirname}/static`));
app.use(cookieParser());
app.use(
  session({
    secret: 'Intrinsicly',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use((req, res, next) => {
  if (req.session.pageCount) req.session.pageCount += 1;
  else req.session.pageCount = 1;
  next();
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
