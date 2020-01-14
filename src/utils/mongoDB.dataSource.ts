import { IDataSourceSwitch } from '../dataSourceSwitch';
import { DataResults, MongoDBDataSource, BaseDataSource } from '../models/index';
import { DataSourceHelper } from './dataSource.helper';
import { MongoClient, MongoClientOptions, FilterQuery } from 'mongodb';

require('dotenv').config();
var DataSourceSwitch = require('../dataSourceSwitch');

var winston = require('../config/winston');

export class MongoDBCommandHandler {
    public static runCommand(
        dataSource: BaseDataSource,
        inputDetails: any = undefined,
        rows: any[] = [{}]
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const ds: IDataSourceSwitch = DataSourceSwitch.default;

            let obsCollection: Array<Promise<any>> = [];

            let mongoDBSource = dataSource.itemDetails as MongoDBDataSource;

            // Load the connection string
            let connString = process.env['CONN_' + mongoDBSource.connection];

            if (!connString) {
                // If failed Try again without the prefix
                connString = process.env[mongoDBSource.connection];
            }

            // Return value ready
            let dataResults: DataResults = {
                expiresSeconds: 0,
                rowCount: 0,
                jsonData: '',
                results: [{ success: true, message: '' }]
            };

            let options: MongoClientOptions = {
                useNewUrlParser: true
            };

            MongoClient.connect(connString, options)
                .then(mongoClient => {
                    // When successfully connected
                    winston.info('MongoClient default connection Made');

                    // Call API For each Row in rows
                    rows.forEach(currentRow => {
                        let replacedCommandString: string;
                        // Mongodb call is either find or aggregate
                        if (mongoDBSource.find) {
                            replacedCommandString = DataSourceHelper.replaceValuesInString(
                                mongoDBSource.find,
                                inputDetails
                            );
                            replacedCommandString = DataSourceHelper.replaceValuesInString(
                                replacedCommandString,
                                currentRow
                            );
                            // Clear down remaining parameter values
                            replacedCommandString = DataSourceHelper.clearRemainingPlaceholders(replacedCommandString);

                            obsCollection.push(
                                this.runFind(
                                    mongoClient,
                                    mongoDBSource.databaseName,
                                    mongoDBSource.collectionName,
                                    JSON.parse(replacedCommandString)
                                )
                            );
                        } else if (mongoDBSource.aggregatePipeLine) {
                            replacedCommandString = DataSourceHelper.replaceValuesInString(
                                mongoDBSource.aggregatePipeLine,
                                inputDetails
                            );
                            replacedCommandString = DataSourceHelper.replaceValuesInString(
                                replacedCommandString,
                                currentRow
                            );
                            // Clear down remaining parameter values
                            replacedCommandString = DataSourceHelper.clearRemainingPlaceholders(replacedCommandString);
                        }

                        obsCollection.push(
                            this.runAggregate(
                                mongoClient,
                                mongoDBSource.databaseName,
                                mongoDBSource.collectionName,
                                JSON.parse(replacedCommandString)
                            )
                        );
                    });

                    Promise.all(obsCollection).then(
                        results => {
                            resolve({
                                expiresSeconds: dataSource.expires,
                                success: true,
                                jsonData: results[0]
                            });
                        },
                        err => {
                            reject(err);
                        }
                    );
                })
                .catch((err: Error) => {
                    winston.error(err, `Error connecting to Mongodb`);
                });
        });
    }

    private static runFind(
        mongoClient: MongoClient,
        databaseName: string,
        collectionName: string,
        replacedCommand: any
    ): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let db = mongoClient.db(databaseName);
            let collection = db.collection(collectionName);
            collection
                .find(replacedCommand)
                .toArray()
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private static runAggregate(
        mongoClient: MongoClient,
        databaseName: string,
        collectionName: string,
        replacedCommand: any
    ): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let db = mongoClient.db(databaseName);
            let collection = db.collection(collectionName);
            collection
                .aggregate(replacedCommand)
                .toArray()
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
