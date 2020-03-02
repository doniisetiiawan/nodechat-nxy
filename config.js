const config = {
  port: 3000,
  secret: 'Progressively',
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
};

module.exports = config;
