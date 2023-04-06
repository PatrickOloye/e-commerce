const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.JWT_SECRET;
  return expressJwt({
    secret,
    // audience: 'http://myap/protected',
    // issuer: 'http://issuer',
    isRevoked: isRevoked,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: /\/api\v0\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\v0\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v0/users',
      '/api/v0/users/register',
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
