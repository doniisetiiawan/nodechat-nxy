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
  console.log(req.body);
  res.send(`${req.body.username} ${req.body.password}`);
}
function chat(req, res) {
  res.send('Chat');
}

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
