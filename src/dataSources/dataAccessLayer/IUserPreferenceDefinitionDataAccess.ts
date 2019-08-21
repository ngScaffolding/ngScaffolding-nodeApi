import { UserPreferenceDefinition } from '../../models/index';

export interface IUserPreferenceDefinitionDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]>;
    saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition>
}