import * as express from 'express';
import ApplicationLogRouter from '../controllers/applicationLog/applicationLog.router';
import AppSettingsRouter from '../controllers/appSettings/appSettings.router';
import ReferenceValuesRouter from '../controllers/referenceValues/referenceValues.router';
import MenuItemRouter from '../controllers/menuItem/menuItem.router';
import DataSourceRouter from '../controllers/dataSource/dataSource.router';
import ErrorRouter from '../controllers/error/error.router';
import UserPreferenceDefinitionRouter from '../controllers/userPreferenceDefinition/userPreferenceDefinition.router';
import UserPreferenceValueRouter from '../controllers/userPreferenceValue/userPreferenceValue.router';
import DefaultRouter from './defaultRouter';

import isUserInRole from '../auth/authoriseRoles';
import WidgetsRouter from '../controllers/widgets/widgets.router';
import RolesRouter from '../controllers/roles/roles.router';
import WorkItemsRouter from '../fieldforce/controllers/workItems.controller';
import StatusUpdatesRouter from '../fieldforce/controllers/statusUpdates.controller';

// import ActionRouter from '../controllers/action/action.router';
// import * as swaggerUi from 'swagger-ui-express';
// var swaggerDocument = require('./swagger.json');
 
export class RouterSetup{

    constructor(private express: express.Application){
    }

    configure(){
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    
   // this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.express.use('/', router);
    this.express.use('/', DefaultRouter);
    this.express.use('/api/v1/applicationLog', ApplicationLogRouter);
    this.express.use('/api/v1/appsettings', AppSettingsRouter);
    this.express.use('/api/v1/referencevalues', isUserInRole('user'), ReferenceValuesRouter);
    this.express.use('/api/v1/menuitems', isUserInRole('user'), MenuItemRouter);
    this.express.use('/api/v1/datasource', isUserInRole('user'), DataSourceRouter);
    this.express.use('/api/v1/userpreferencedefinition', isUserInRole('user'), UserPreferenceDefinitionRouter);
    this.express.use('/api/v1/userpreferencevalue', isUserInRole('user'), UserPreferenceValueRouter);
    this.express.use('/api/v1/widgets', isUserInRole('user'), WidgetsRouter);
    this.express.use('/api/v1/roles', isUserInRole('user'), RolesRouter);

    this.express.use('/api/v1/workitems', isUserInRole('user'), WorkItemsRouter);
    this.express.use('/api/v1/statusupdates', isUserInRole('user'), StatusUpdatesRouter);
    this.express.use('/api/v1/error', ErrorRouter);
    
    }
}