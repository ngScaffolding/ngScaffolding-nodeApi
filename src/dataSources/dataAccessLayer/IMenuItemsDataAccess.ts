import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IMenuItemsDataAccess {

    // Get All Menu Items - For Admin Purposes
    getMenuItem(name: string): Observable<CoreMenuItem>;
    
    // Get Menu Items for Current User
    getMenuItems(): Observable<CoreMenuItem[]>;
    
    saveMenuItem(menuItem: CoreMenuItem): Observable<CoreMenuItem>;
    deleteMenuItem(name: string): Observable<any>;
}