const util = require('../middleware/utilities');
const config = require('../config');

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
function loginProcess(req, res) {
  const isAuth = util.auth(
    req.body.username,
    req.body.password,
    req.session,
  );
  if (isAuth) {
    res.redirect('/chat');
  } else {
    res.redirect(config.routes.login);
  }
}
function logOut(req, res) {
  util.logOut(req.session);
  res.redirect('/');
}
function chat(req, res) {
  res.send('Chat');
}

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.logOut = logOut;
module.exports.chat = chat;
