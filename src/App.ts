import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import authoriseRequest from './auth/authoriseRequest';
import { initialSetup } from './initialSetup/setup';

var winston = require('./config/winston');

var jwt = require('express-jwt');
var cors = require('cors')

import { RouterSetup } from './routes/routing';

// Get the command line params
var argv = require('minimist')(process.argv.slice(2));

// Creates and configures an ExpressJS web server.
class App {
  
  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    if (argv['setup']) {
      winston.info('Running Initial setup');
      initialSetup();
    }

    winston.info('API Starting');
    
    this.express = express();
    this.middleware();

   let router = new RouterSetup(this.express);
   router.configure();
  }

  // Configure Express middleware.
  private middleware(): void {

    this.express.get('/', (req,res) => {
      res.send('nodeAPI Running');
  });

    this.express.use(morgan('combined', { stream: winston.stream }));
    this.express.use(bodyParser.json());
    this.express.use(cors())
    this.express.use(authoriseRequest);
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().express;