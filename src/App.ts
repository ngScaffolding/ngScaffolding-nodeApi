import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import authoriseRequest from './auth/authoriseRequest';
import { initialSetup } from './initialSetup/setup';

var winston = require('./config/winston');

var jwt = require('express-jwt');
var cors = require('cors');
const fs = require('fs');

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

        winston.info(`__dirname: ${__dirname}`);

        // Add builddate
        const pathIndex = 'index.js';
        var buildDate = 'Debug Mode'
        if (fs.existsSync(pathIndex)) {
            const { mtime } = fs.statSync(pathIndex);
            buildDate = mtime;
        }
        winston.info(`Build Date: ${buildDate}`);
        this.express.locals.buildDate = buildDate;
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.set('views', 'views');
        this.express.set('view engine', 'pug');
        this.express.use(morgan('combined', { stream: winston.stream }));
        this.express.use(bodyParser.json({ limit: '10mb' }));
        this.express.use(cors());
        this.express.use(authoriseRequest);
        this.express.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
        this.express.use(function(err, req, res, next) {
            if (err) {
                winston.error(err);
                console.error(err);
            }
        });
    }
}

export default new App().express;
