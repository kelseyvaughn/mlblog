import mongoose from 'mongoose';
import config from './config/main';
import app from './config/express';

// set mongoose to use promises rather than callbacks
mongoose.Promise = Promise;
// connect to mongoDB
mongoose.connect(config.mongo.host);  

// Start the server 
app.listen(config.port, () => {console.log(`server started on port ${config.port}`)});

export default app;