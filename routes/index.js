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
