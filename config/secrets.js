module.exports = {
  
  db: process.env.MONGODB|| 'mongodb://localhost:27017/test',
  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',
  localAuth: false,

  mailgun: {
    login: process.env.MAILGUN_LOGIN || 'Your Mailgun SMTP Username',
    password: process.env.MAILGUN_PASSWORD || 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'Your SendGrid Username',
    password: process.env.SENDGRID_PASSWORD || 'Your SendGrid Password'
  },

  githubAuth: true,
  github: {
    clientID: process.env.GITHUB_ID || 'Your ID',
    clientSecret: process.env.GITHUB_SECRET || 'Your Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  googleAuth: true,
  google: {
    clientID: process.env.GOOGLE_ID || 'Your Client ID',
    clientSecret: process.env.GOOGLE_SECRET || 'Your Client Secret',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  }

};
