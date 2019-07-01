import { AppSettingsValue } from '../../models/src/index';

export interface IAppSettingsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getAppSettingsValues(): Promise<AppSettingsValue[]>;
    
}