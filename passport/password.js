import crypto from 'crypto';
import scmp from 'scmp';
import config from '../config';

const passwordCreate = (password, cb) => {
  crypto.randomBytes(
    config.crypto.randomSize,
    (err, salt) => {
      if (err) return cb(err, null);
      crypto.pbkdf2(
        password,
        salt.toString('base64'),
        config.crypto.workFactor,
        config.crypto.keylen,
        config.crypto.digest,
        (err, key) => {
          cb(
            null,
            salt.toString('base64'),
            key.toString('base64'),
          );
        },
      );
    },
  );
};

const passwordCheck = (
  password,
  derivedPassword,
  salt,
  work,
  cb,
) => {
  crypto.pbkdf2(
    password,
    salt,
    work,
    config.crypto.keylen,
    config.crypto.digest,
    (err, key) => {
      const derivedKey = Buffer.from(
        key.toString('base64'),
      );
      const derivedPass = Buffer.from(derivedPassword);
      cb(null, scmp(derivedKey, derivedPass));
    },
  );
};

export { passwordCreate, passwordCheck };
