import { AppSettingsValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IAppSettingsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getAppSettingsValues(): Observable<AppSettingsValue[]>;
    
}