/**
 * Config passport middleware with authentication strategy
 */

import _passport from 'passport';
import _passportJWT from 'passport-jwt';
import config from './main';
import jwks from 'jwks-rsa'

const passport = _passport();
const passportJWT = _passportJWT();

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

/**
 * Set the options for passport-jwt
 * use auth0 secret format - RSA Signing key
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: config.AUTH0_JWKS_URI,
      issuer: config.AUTH0_ISSUER,
      algorithm: ['RS256']
  })
};

/**
 * Set the passport strategy
 */
const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
      next(null, user);
  } else {
      next(null, false);
  }
});

passport.use(strategy);

export default passport;
