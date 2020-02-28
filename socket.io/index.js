let io = require('socket.io');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const ConnectRedis = require('connect-redis')(
  expressSession,
);
const redis = require('redis');

const config = require('../config');

const redisClient = redis.createClient();
const redisSession = new ConnectRedis({
  client: redisClient,
});

const socketAuth = function socketAuth(socket, next) {
  const handshakeData = socket.request;
  const parsedCookie = cookie.parse(
    handshakeData.headers.cookie,
  );
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    config.secret,
  );

  if (parsedCookie['connect.sid'] === sid) return next(new Error('Not Authenticated'));

  redisSession.get(sid, (err, session) => {
    if (session.isAuthenticated) {
      socket.user = session.user;
      socket.sid = sid;
      return next();
    }
    return next(new Error('Not Authenticated'));
  });

  return next(new Error('Nothing Defined'));
};

const socketConnection = function socketConnection(socket) {
  socket.emit('message', { message: 'Hey!' });
  socket.emit('message', socket.user);
};

exports.startIo = function startIo(server) {
  io = io.listen(server);
  const packtchat = io.of('/packtchat');

  packtchat.use(socketAuth);
  packtchat.on('connection', socketConnection);

  return io;
};

exports.io = io;
