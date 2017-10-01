/**
 * @fileoverview Define environment config constants 
 */

// configure dotenv which loads vars in .env in PROCESS.ENV
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT
  },
  auth0: {
    jwks_uri: process.env.AUTH0_JWKS_URI,
    issuer: process.env.AUTH0_ISSUER,
    username_claim: process.env.AUTH0_USERNAME_CLAIM
  }
};

export default config;