const User = function User(id, name, type) {
  if (arguments.length < 3) return new Error('Not enough args!');
  return { id, user: name, type };
};

const Chat = function Chat(message, room, user) {
  if (arguments.length < 3) return new Error('Not enough args!');
  if (typeof user !== 'object') return new Error('User must be an object!');
  return {
    id: user.id + new Date().getTime().toString(),
    message,
    room,
    ts: new Date().getTime(),
    user,
  };
};

const Room = function Room(name) {
  if (arguments.length < 1) return new Error('Room needs a name!');
  return { id: name, name };
};

export { User, Chat, Room };
