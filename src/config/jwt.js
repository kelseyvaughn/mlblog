/**
 * @fileoverview Config middleware to validate JWTs
 */

import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import config from './main';

var secretCB = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: config.auth0.jwks_uri
});

var validateJWT = jwt({
  secret: secretCB,
  issuer: config.auth0.issuer,
  algorithms: ['RS256'],
  requestProperty: "token"
});

export default {validateJWT}