import { CoreMenuItem } from '@ngscaffolding/models';

export interface IMenuItemsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getMenuItem(name: string): Promise<CoreMenuItem>;
    
    // Get Menu Items for Current User
    getMenuItems(): Promise<CoreMenuItem[]>;
    
    saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem>;
    deleteMenuItem(name: string): Promise<any>;
}