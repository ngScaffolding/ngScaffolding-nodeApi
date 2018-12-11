import { UserPreferenceValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IUserPreferenceValueDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceValues(userId: string): Observable<UserPreferenceValue[]>;
    saveUserPreferenceValue(userId: string, name: string, value: string): Observable<UserPreferenceValue>;
    deleteUserPreferenceValue(userId, string, name: string): Observable<any>;
}