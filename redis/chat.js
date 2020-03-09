import q from 'q';
import client from './index';
import { User } from './models';

const addUser = (user, name, type) => {
  client
    .multi()
    .hset(`user:${user}`, 'name', name)
    .hset(`user:${user}`, 'type', type)
    .zadd('users', Date.now(), user)
    .exec();
};

const addRoom = (room) => {
  if (room !== '') client.zadd('rooms', Date.now(), room);
};

const getRooms = (cb) => {
  client.zrevrangebyscore(
    'rooms',
    '+inf',
    '-inf',
    (err, data) => cb(data),
  );
};

const addChat = (chat) => {
  client
    .multi()
    .zadd(
      `rooms:${chat.room}:chats`,
      Date.now(),
      JSON.stringify(chat),
    )
    .zadd('users', Date.now(), chat.user.id)
    .zadd('rooms', Date.now(), chat.room)
    .exec();
};

const getChat = (room, cb) => {
  client.zrange(
    `rooms:${room}:chats`,
    0,
    -1,
    (err, chats) => {
      cb(chats);
    },
  );
};

const addUserToRoom = (user, room) => {
  client
    .multi()
    .zadd(`rooms:${room}`, Date.now(), user)
    .zadd('users', Date.now(), user)
    .zadd('rooms', Date.now(), room)
    .set(`user:${user}:room`, room)
    .exec();
};

const removeUserFromRoom = (user, room) => {
  client
    .multi()
    .zrem(`rooms:${room}`, user)
    .del(`user:${user}:room`)
    .exec();
};

// eslint-disable-next-line no-unused-vars
const getUsersinRoom = (room) => q.Promise((resolve, reject, notify) => {
  client.zrange(`rooms:${room}`, 0, -1, (err, data) => {
    const users = [];
    let loopsleft = data.length;
    data.forEach((u) => {
      client.hgetall(`user:${u}`, (err, userHash) => {
        users.push(User(u, userHash.name, userHash.type));
        loopsleft--;
        if (loopsleft === 0) resolve(users);
      });
    });
  });
});

export {
  addUser,
  addRoom,
  getRooms,
  addChat,
  getChat,
  addUserToRoom,
  removeUserFromRoom,
  getUsersinRoom,
};
