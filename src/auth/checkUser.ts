import { BasicUser, CoreMenuItem, AppSettings } from '../models/index';
import { getSetting } from '../utils/appSettings.helper';

export function checkUser(user: BasicUser, menu: CoreMenuItem): boolean {
    
    // For owned menu items only owner is allowed
    if (menu.ownerId) {
        const uniqueField = getSetting(AppSettings.authUserUniqueField, 'userId');

        return user[uniqueField] === menu.ownerId;
    }

    // This means that items with no allowedRoles - Everyone gets to play
    if (!menu.roles) return true;

    var checkUserRoles = [...user.role];
    var checkAllowedRoles = [];

    if (Array.isArray(menu.roles)) {
        checkAllowedRoles = [...menu.roles];
    } else {
        checkAllowedRoles = [menu.roles];
    }

    var isUserCool = false;
    checkUserRoles.forEach(checkUserRole => {
        checkAllowedRoles.forEach(checkAllowedRole => {
            if (checkUserRole === checkAllowedRole) {
                isUserCool = true;
            }
        });
    });

    if (menu.userIds) {
        menu.userIds.forEach(allowedUser => {
            if (allowedUser.toLowerCase() === user.userId.toLowerCase()) {
                isUserCool = true;
            }
        });
    }

    return isUserCool;
}
