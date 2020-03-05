import { error as errorIya } from './log';

const notFound = (req, res) => {
  res
    .status(404)
    .send(
      'You seem lost. You must have taken a wrong turn back there.',
    );
};

const error = (err, req, res, next) => {
  errorIya({ error: err.message, ts: Date.now() });
  res.status(500).render('500', { title: 'Mistakes Were Made' });
  next();
};

export { notFound, error };
