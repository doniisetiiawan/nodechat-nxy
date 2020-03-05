import config from '../config';

const csrf = (req, { locals }, next) => {
  locals.token = req.csrfToken();
  next();
};

const authenticated = (req, { locals }, next) => {
  locals.isAuthenticated = req.isAuthenticated();
  if (req.isAuthenticated()) {
    locals.user = req.user;
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
