const util = require('../middleware/utilities');
const config = require('../config');
const user = require('../passport/user');

function index(req, res) {
  res.cookie('IndexCookie', 'This was set from Index');
  res.send(
    `${JSON.stringify(req.cookies)}===${JSON.stringify(
      req.session,
    )}===${JSON.stringify(
      req.signedCookies,
    )}===${JSON.stringify(req.csrfToken())}`,
  );
}
function login(req, res) {
  res.send('Login');
}
function register(req, res) {
  res.send('Register');
}
function registerProcess(req, res) {
  if (req.body.username && req.body.password) {
    user.addUser(
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
}
function logOut(req, res) {
  util.logOut(req);
  res.redirect('/');
}
function chat(req, res) {
  res.send('Chat');
}

module.exports.index = index;
module.exports.login = login;
module.exports.logOut = logOut;
module.exports.chat = chat;
module.exports.register = register;
module.exports.registerProcess = registerProcess;
