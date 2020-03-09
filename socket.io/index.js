import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import redis from 'redis';
import redisAdapter from 'socket.io-redis';
import config from '../config';
import {
  addUser,
  removeUserFromRoom,
  getChat,
  addChat,
  getRooms,
  addRoom,
  addUserToRoom,
  getUsersinRoom,
} from '../redis/chat';
import { User, Chat, Room } from '../redis/models';
import { error } from '../middleware/log';

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

  redisSession.get(sid, (err, session) => {
    if (session.isAuthenticated) {
      socket.request.user = session.passport.user;
      socket.request.sid = sid;
      addUser(
        session.passport.user.id,
        session.passport.user.displayName,
        session.passport.user.provider,
      );
      return next();
    }
    return next(new Error('Not Authenticated'));
  });
};

const removeFromRoom = (socket, room) => {
  socket.leave(room);
  removeUserFromRoom(socket.request.user.id, room);
  socket.broadcast
    .to(room)
    .emit(
      'RemoveUser',
      User(
        socket.request.user.id,
        socket.request.user.displayName,
        socket.request.user.provider,
      ),
    );
};

const removeAllRooms = (socket, cb) => {
  const current = socket.rooms;
  const len = Object.keys(current).length;
  let i = 0;
  current.forEach((element) => {
    if (element !== socket.id) {
      removeFromRoom(socket, element);
    }
    i++;
    if (i === len) cb();
  });
};

const socketConnection = (socket) => {
  socket.on('GetMe', () => {
    socket.emit(
      'GetMe',
      User(
        socket.request.user.id,
        socket.request.user.displayName,
        socket.request.user.provider,
      ),
    );
  });

  socket.on('GetUser', (room) => {
    const usersP = getUsersinRoom(room.room);
    usersP.done((users) => {
      socket.emit('GetUser', users);
    });
  });

  socket.on('GetChat', (data) => {
    getChat(data.room, (chats) => {
      const retArray = [];
      let len = chats.length;
      chats.forEach((c) => {
        try {
          retArray.push(JSON.parse(c));
        } catch (e) {
          error(e.message);
        }
        len--;
        if (len === 0) socket.emit('GetChat', retArray);
      });
    });
  });

  socket.on('AddChat', (chat) => {
    const newChat = Chat(
      chat.message,
      chat.room,
      User(
        socket.request.user.id,
        socket.request.user.displayName,
        socket.request.user.provider,
      ),
    );
    addChat(newChat);
    socket.broadcast.to(chat.room).emit('AddChat', newChat);
    socket.emit('AddChat', newChat);
  });

  socket.on('GetRoom', () => {
    getRooms((rooms) => {
      const retArray = [];
      let len = rooms.length;
      rooms.forEach((r) => {
        retArray.push(Room(r));
        len--;
        if (len === 0) socket.emit('GetRoom', retArray);
      });
    });
  });

  socket.on('AddRoom', (r) => {
    const room = r.name;
    removeAllRooms(socket, () => {
      if (room !== '') {
        socket.join(room);
        addRoom(room);
        socket.broadcast.emit('AddRoom', Room(room));
        socket.broadcast
          .to(room)
          .emit(
            'AddUser',
            User(
              socket.request.user.id,
              socket.request.user.displayName,
              socket.request.user.provider,
            ),
          );
        addUserToRoom(socket.request.user.id, room);
      }
    });
  });

  socket.on('disconnect', () => {
    removeAllRooms(socket, () => {});
  });
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
export default startIo;
