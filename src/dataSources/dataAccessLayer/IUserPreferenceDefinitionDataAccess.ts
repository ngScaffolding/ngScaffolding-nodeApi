import { UserPreferenceDefinition } from '@ngscaffolding/models';

export interface IUserPreferenceDefinitionDataAccess {

    // Get All Menu Items - For Admin Purposes
    getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]>;
}