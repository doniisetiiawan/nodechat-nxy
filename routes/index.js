function index(req, res) {
  res.cookie('IndexCookie', 'This was set from Index');
  res.send(
    `${JSON.stringify(req.cookies)}===${JSON.stringify(
      req.session,
    )}===${JSON.stringify(req.signedCookies)}`,
  );
}
function login(req, res) {
  res.send('Login');
}
function loginProcess(req, res) {
  res.redirect('/');
}
function chat(req, res) {
  res.send('Chat');
}

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
