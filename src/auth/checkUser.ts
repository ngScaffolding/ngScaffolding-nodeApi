export function checkUser(userRoles: string | string[], allowedRoles: string | string[]): boolean {

    // This means that items with no allowedRoles - Everyone gets to play
    if(!allowedRoles) return true;

    var checkUserRoles = [...userRoles];
    var checkAllowedRoles = [...allowedRoles];

    var isUserCool = false;
    checkUserRoles.forEach(checkUserRole => {
        checkAllowedRoles.forEach(checkAllowedRole => {
            if(checkUserRole === checkAllowedRole){
                isUserCool = true;
            }
        })
    });

    return isUserCool;

}