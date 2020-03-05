import config from '../config';

const csrf = (req, res, next) => {
  res.locals.token = req.csrfToken();
  next();
};

const authenticated = (req, res, next) => {
  req.session.isAuthenticated = req.user !== undefined;
  res.locals.isAuthenticated = req.session.isAuthenticated;
  if (req.session.isAuthenticated) {
    res.locals.user = req.user;
  }
  next();
};

const requireAuthentication = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect(config.routes.login);
  }
};

const logOut = (req) => {
  req.session.isAuthenticated = false;
  req.logout();
};

const templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;

  next();
};

export {
  csrf,
  authenticated,
  requireAuthentication,
  logOut,
  templateRoutes,
};
