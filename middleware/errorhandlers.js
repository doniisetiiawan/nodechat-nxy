import { error as errorIya } from './log';

const notFound = (req, res) => {
  res
    .status(404)
    .send(
      'You seem lost. You must have taken a wrong turn back there.',
    );
};

const error = ({ message }, req, res, next) => {
  errorIya({ error: message, ts: Date.now() });
  res.status(500).send('Something broke. What did you do?');
};

export { notFound, error };
