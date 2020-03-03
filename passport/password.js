const crypto = require('crypto');
const scmp = require('scmp');
const config = require('../config');

const passwordCreate = function passwordCreate(
  password,
  cb,
) {
  crypto.randomBytes(
    config.crypto.randomSize,
    (err, salt) => {
      if (err) return cb(err, null);
      crypto.pbkdf2(
        password,
        salt.toString('base64'),
        config.crypto.workFactor,
        config.crypto.keylen,
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

const passwordCheck = function passwordCheck(
  password,
  derivedPassword,
  salt,
  work,
  cb,
) {
  crypto.pbkdf2(
    password,
    salt,
    work,
    config.crypto.keylen,
    (err, key) => {
      cb(
        null,
        scmp(key.toString('base64'), derivedPassword),
      );
    },
  );
};

exports.passwordCreate = passwordCreate;
exports.passwordCheck = passwordCheck;
