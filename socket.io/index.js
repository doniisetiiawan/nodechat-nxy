import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import redis from 'redis';
import redisAdapter from 'socket.io-redis';
import config from '../config';

let io = require('socket.io');

const ConnectRedis = require('connect-redis')(
  expressSession,
);

const redisClient = redis.createClient();
const redisSession = new ConnectRedis({
  client: redisClient,
});

const socketAuth = (socket, next) => {
  const handshakeData = socket.request;
  const parsedCookie = cookie.parse(
    handshakeData.headers.cookie,
  );
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    config.secret,
  );

  if (parsedCookie['connect.sid'] === sid) return next(new Error('Not Authenticated'));

  redisSession.get(sid, (err, { isAuthenticated, user }) => {
    if (isAuthenticated) {
      socket.user = user;
      socket.sid = sid;
      return next();
    }
    return next(new Error('Not Authenticated'));
  });

  return next(new Error('Nothing Defined'));
};

const socketConnection = (socket) => {
  socket.on('GetMe', () => {});
  socket.on('GetUser', (room) => {});
  socket.on('GetChat', (data) => {});
  socket.on('AddChat', (chat) => {});
  socket.on('GetRoom', () => {});
  socket.on('AddRoom', (r) => {});
  socket.on('disconnect', () => {});
};

const startIo = (server) => {
  io = io.listen(server);

  io.adapter(
    redisAdapter({
      redisClient,
    }),
  );

  const packtchat = io.of('/packtchat');

  packtchat.use(socketAuth);
  packtchat.on('connection', socketConnection);

  return io;
};
export default startIo

