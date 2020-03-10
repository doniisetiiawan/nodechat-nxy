// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  presets: ['@babel/preset-env'],
});

const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), 'dev.env'),
});

module.exports = require('./app');
