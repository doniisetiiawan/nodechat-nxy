const config = {
  port: 3000,
  secret: 'Continually',
  routes: {
    login: '/account/login',
    logout: '/account/logout',
    chat: '/chat',
    facebookAuth: '/auth/facebook',
    facebookAuthCallback: '/auth/facebook/callback',
    googleAuth: '/auth/google',
    googleAuthCallback: '/auth/google/callback',
  },
  host: 'http://localhost:3000',
  facebook: {
    appID: 'YOUR_ID',
    appSecret: 'YOUR_SECRET',
  },
  google: {
    clientID: 'YOUR_ID',
    clientSecret: 'YOUR_SECRET',
  },
  crypto: {
    workFactor: 5000,
    keylen: 32,
    randomSize: 256,
  },
};

module.exports = config;
