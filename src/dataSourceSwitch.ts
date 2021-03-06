import { IDataAccessLayer } from './dataSources/dataAccessLayer';
import { MongoDBDataAccess } from './dataSources/mongodb/mongoDBDataAccess';
import { DocumentDBDataAccess } from './dataSources/documentdb';
import { AzureStorageDataAccess } from './dataSources/azureStorage';
import { MsSQLDataAccess } from './dataSources/mssql/msSQLDataAccess';
import { CosmosDBDataAccess } from './dataSources/cosmosDb/cosmosDB.dataAccess';

require('dotenv').config();

var winston = require('./config/winston');

export interface IDataSourceSwitch {
    dataSource: IDataAccessLayer;
}

class DataSourceSwitch {
    constructor() {
        if (!process.env.DATA_SOURCE) {
            winston.error('Missing DATA_SOURCE in Env Variables. Exiting');
            process.exit(1);
        }
        switch (process.env.DATA_SOURCE.toLowerCase()) {
            case 'mongodb': {
                winston.info('Running MongoDB Data Source');
                this.dataSource = new MongoDBDataAccess();
                break;
            }
            case 'azurestorage': {
                winston.info('Running Azure Storage Data Source');
                this.dataSource = new AzureStorageDataAccess();
                break;
            }
            case 'documentdb': {
                winston.info('Running DocumentDB Data Source');
                // this.dataSource = new DocumentDBDataAccess();
                break;
            }
            case 'mssql': {
                winston.info('Running MS SQL Data Source');
                this.dataSource = new MsSQLDataAccess();
                break;
            }
            case 'cosmosdb': {
                winston.info('Running Cosmosdb Data Source');
                this.dataSource = new CosmosDBDataAccess();
                break;
            }
            default: {
                winston.error(`Unknown value for DATA_SOURCE in Env Variables (${process.env.DATA_SOURCE}). Exiting`);
                process.exit(1);
            }
        }
    }

    public dataSource: IDataAccessLayer;
}

const dataSourceSwitch = new DataSourceSwitch();

export default dataSourceSwitch;
