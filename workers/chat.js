import { debug, error } from '../middleware/log';
import client from '../redis';

const delta = 60 * 60 * 1000 * 3; // 10800000
const interval = 60 * 60 * 1000 * 2; // 7200000

const RemoveRooms = () => {
  debug({ message: 'Removing Rooms', ts: Date.now() });
  client.zrangebyscore(
    'rooms',
    '-inf',
    new Date().getTime() - delta,
    (err, rooms) => {
      if (err !== null) {
        error({
          message: 'Error in Remove Rooms',
          err,
          ts: Date.now(),
        });
      } else {
        rooms.forEach((room) => {
          client
            .multi()
            .zrem('rooms', room)
            .del(`rooms:${room}:chats`)
            .exec();
        });
      }
    },
  );
};

const CleanUpChatsFromRoom = () => {
  debug({ message: 'Cleaning Up Chats', ts: Date.now() });
  client.zrange('rooms', 0, -1, (err, rooms) => {
    rooms.forEach((room) => {
      client.zremrangebyscore(
        `rooms:${room}:chats`,
        '-inf',
        new Date().getTime() - delta,
      );
    });
  });
};

const CleanUpUsers = () => {
  debug({ message: 'Cleaning Up Users', ts: Date.now() });
  client.zrangebyscore(
    'users',
    '-inf',
    new Date().getTime() - delta,
    (err, users) => {
      users.forEach((user) => {
        client
          .multi()
          .zrem('users', user)
          .del(`user:${user}`)
          .del(`user:${user}:room`)
          .exec();
      });
    },
  );
};

const CleanUp = () => {
  RemoveRooms();
  CleanUpChatsFromRoom();
  CleanUpUsers();
};

setInterval(CleanUp, interval);
CleanUp();
