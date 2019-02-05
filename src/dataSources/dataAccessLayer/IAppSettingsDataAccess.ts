import { AppSettingsValue } from '@ngscaffolding/models';

export interface IAppSettingsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getAppSettingsValues(): Promise<AppSettingsValue[]>;
    
}