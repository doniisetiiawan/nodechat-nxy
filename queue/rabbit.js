import amqp from 'amqp';
import q from 'q';
import config from '../config';

export default q.Promise((resolve, reject, notify) => {
  const rabbit = amqp.createConnection(config.rabbitMQ.URL);
  rabbit.on('ready', () => {
    resolve(rabbit);
  });
});
