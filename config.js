const config = {
  port: 3000,
  secret: 'Progressively',
  routes: {
    login: '/account/login',
    logout: '/account/logout',
    chat: '/chat',
    facebookAuth: '/auth/facebook',
    facebookAuthCallback: '/auth/facebook/callback',
  },
  host: 'http://localhost:3000',
  facebook: {
    appID: 'YOUR_ID',
    appSecret: 'YOUR_SECRET',
  },
};

module.exports = config;
