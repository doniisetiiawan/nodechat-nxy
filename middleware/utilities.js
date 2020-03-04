import config from '../config';

const csrf = (req, { locals }, next) => {
  locals.token = req.csrfToken();
  next();
};

const authenticated = ({ session }, { locals }, next) => {
  session.isAuthenticated = session.passport.user !== undefined;
  locals.isAuthenticated = session.isAuthenticated;
  if (session.isAuthenticated) {
    locals.user = session.passport.user;
  }
  next();
};

const requireAuthentication = ({ session }, res, next) => {
  if (session.isAuthenticated) {
    next();
  } else {
    res.redirect(config.routes.login);
  }
};

const auth = (username, password, session) => {
  const isAuth = username === 'joshua' || username === 'brian';
  if (isAuth) {
    session.isAuthenticated = isAuth;
    session.user = { username };
  }
  return isAuth;
};

const logOut = (req) => {
  req.session.isAuthenticated = false;
  req.logout();
};

const templateRoutes = (req, { locals }, next) => {
  locals.routes = config.routes;
  next();
};

export {
  csrf, authenticated, requireAuthentication, logOut, templateRoutes,
};
