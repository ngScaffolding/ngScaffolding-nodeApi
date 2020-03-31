import { CosmosClient, Database, Container, Item } from '@azure/cosmos';
import { env } from 'shelljs';
const debug = require('debug')('cosmosDB:helper');

export class CosmosDBHelper {
    private cosmosClient: CosmosClient;
    private cosmosDatabase: Database;
    private cosmosContainer: Container;
    private dbHost: string;
    private dbName: string;
    private dbContainer: string;

    constructor() {
        this.init();
    }

    async init() {
        this.dbHost = process.env.DB_HOST;
        this.dbName = process.env.COSMOS_DATABASE;
        this.dbContainer = process.env.COSMOS_CONTAINER || 'Dashboard';

        this.cosmosClient = new CosmosClient({
            endpoint: this.dbHost,
            key: process.env.COSMOS_KEY
        });

        this.cosmosDatabase = await this.cosmosClient.database(this.dbName);
        this.cosmosContainer = await this.cosmosDatabase.container(this.dbContainer);
    }

    async find(querySpec) {
        debug('Querying for items from the database');
        if (!this.cosmosContainer) {
            throw new Error('Collection is not initialized.');
        }
        const { resources } = await this.cosmosContainer.items.query(querySpec).fetchAll();
        return resources;
    }

    async deleteItem(key: string, partitionKey: string) {
        let item2 = await this.getItem(key, partitionKey);
        return item2.delete();
    }

    async addItem(item) {
        debug('Adding an item to the database');
        item.date = Date.now();
        const { resource: doc } = await this.cosmosContainer.items.create(item);
        return doc;
    }

    async upsertItem(id, item, partitionKey) {
        let existing = await this.getItem(item.name, partitionKey);
        if (existing) {
            return await this.updateItem(item, partitionKey);
        } else {
            item.partitionKey = partitionKey;
            return await this.addItem(item);
        }
    }

    async updateItem(item, partitionKey) {
        // debug('Update an item in the database');
        //const doc = await this.getItem(item.name, partitionKey);
        // doc.completed = true;
        return await this.cosmosContainer.item(item.name, partitionKey).replace(item);
    }

    async getItem(itemId, partitionKey) {
        debug('Getting an item from the database');
        const { resource } = await this.cosmosContainer.item(itemId, partitionKey).read();
        return resource;
    }
}
