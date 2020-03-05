import * as util from '../middleware/utilities';
import config from '../config';
import { addUser } from '../passport/user';

const index = (req, res) => {
  res.cookie('IndexCookie', 'This was set from Index');
  res.send(
    `${JSON.stringify(req.cookies)}===${JSON.stringify(
      req.session,
    )}===${JSON.stringify(
      req.signedCookies,
    )}===${JSON.stringify(
      req.csrfToken(),
    )}===${JSON.stringify(req.user)}`,
  );
};
const login = (req, res) => {
  res.send('Login');
};
const register = (req, res) => {
  res.send('Register');
};
const registerProcess = (req, res) => {
  if (req.body.username && req.body.password) {
    addUser(
      req.body.username,
      req.body.password,
      config.crypto.workFactor,
      (err, profile) => {
        if (err) {
          req.flash('error', err);
          res.redirect(config.routes.register);
        } else {
          req.login(profile, () => {
            res.redirect(config.routes.chat);
          });
        }
      },
    );
  } else {
    req.flash('error', 'Please fill out all the fields');
    res.redirect(config.routes.register);
  }
};
const logOut = (req, res) => {
  util.logOut(req);
  res.redirect('/');
};
const chat = (req, res) => {
  res.send('Chat');
};

export {
  index,
  login,
  logOut,
  chat,
  register,
  registerProcess,
};
