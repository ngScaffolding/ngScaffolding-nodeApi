import { AppSettingsValue } from '../../models/index';

export interface IAppSettingsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getAppSettingsValues(): Promise<AppSettingsValue[]>;
    
}