import passport from 'passport';
import { Strategy as Facebook } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as LocalStrategy } from 'passport-local';
import { passwordCheck } from './password';
import { findByUsername, updatePassword } from './user';
import config from '../config';
import { debug } from '../middleware/log';

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

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL:
        config.host + config.routes.googleAuthCallback,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    },
  ),
);

passport.use(
  new LocalStrategy((username, password, done) => {
    findByUsername(username, (err, profile) => {
      if (profile) {
        passwordCheck(
          password,
          profile.password,
          profile.salt,
          profile.work,
          (err, isAuth) => {
            if (isAuth) {
              if (profile.work < config.crypto.workFactor) {
                updatePassword(
                  username,
                  password,
                  config.crypto.workFactor,
                );
              }
              done(null, profile);
            } else {
              debug({
                message: 'Wrong Username or Password',
                username,
              });
              done(null, false, {
                message: 'Wrong Username or Password',
              });
            }
          },
        );
      } else {
        done(null, false, {
          message: 'Wrong Username or Password',
        });
      }
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const routes = (app) => {
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
  app.get(
    config.routes.googleAuth,
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    }),
  );
  app.get(
    config.routes.googleAuthCallback,
    passport.authenticate('google', {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true,
    }),
  );
  app.post(
    config.routes.login,
    passport.authenticate('local', {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true,
    }),
  );
};

export { passport, routes };
