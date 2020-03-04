import exchange from '../queue';

const debug = (message) => {
  exchange.done((ex) => {
    ex.publish('debug.log', message);
  });
};

const error = (message) => {
  exchange.done((ex) => {
    ex.publish('error.log', message);
  });
};

const logger = ({ url }, res, next) => {
  debug({ url, ts: Date.now() });
  next();
};

export { debug, error, logger };
