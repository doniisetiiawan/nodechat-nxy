const passport = require('passport');
const Facebook = require('passport-facebook').Strategy;
const config = require('../config');

passport.use(
  new Facebook(
    {
      clientID: config.facebook.appID,
      clientSecret: config.facebook.appSecret,
      callbackURL:
        config.host + config.routes.facebookAuthCallback,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const routes = function routes(app) {
  app.get(
    config.routes.facebookAuth,
    passport.authenticate('facebook'),
  );
  app.get(
    config.routes.facebookAuthCallback,
    passport.authenticate('facebook', {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true,
    }),
  );
};

exports.passport = passport;
exports.routes = routes;
