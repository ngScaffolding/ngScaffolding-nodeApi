import { UserPreferenceValue } from '../../models/index';

export interface IUserPreferenceValueDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]>;
    saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue>;
    deleteUserPreferenceValue(userId: string, name: string): Promise<any>;

    getAllProfiles(): Promise<UserPreferenceValue[]>;

}