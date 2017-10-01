/**
 * @fileoverview Set middleware to be used for all requests 
 */

import express from 'express';
import routes from '../routes/indexRoutes';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import config from './main';

const app = express();

// log requests using morgan if development environment
if (config.env === 'development') app.use(logger('dev'));

// secure apps by setting various HTTP headers
app.use(helmet());

// set headers to allow CORS 
// with default options (Origin = *, Methods = (all but OPTIONS))
app.use(cors());

// add BodyParser so that urlencoded bodies
// can be parsed to JSON and exposed in req.body  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json()); 

// allows you to use verbs like PUT or DELETE  
// where the client doesn't support it 
app.use(methodOverride());

// mount all routes on the /api path
app.use('/api', routes);

export default app;