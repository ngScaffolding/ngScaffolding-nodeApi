import { UserPreferenceValue } from '@ngscaffolding/models';

export interface IUserPreferenceValueDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]>;
    saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue>;
    deleteUserPreferenceValue(userPreference: UserPreferenceValue): Promise<any>;
}