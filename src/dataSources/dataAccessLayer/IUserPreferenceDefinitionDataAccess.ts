import { UserPreferenceDefinition } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IUserPreferenceDefinitionDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceDefinitions(): Observable<UserPreferenceDefinition[]>;
}