import { Router, Request, Response, NextFunction } from "express";
import { RequestHandlerParams } from "express-serve-static-core";

export default function isUserInRole(authorisedRoles: string | string[]): RequestHandlerParams {
  const isAllowed = userDetails => {
    let checkRoles: string[] = [];

    // Take values into an array
    if (authorisedRoles instanceof Array) {
      let arrRoles = authorisedRoles as Array<string>;
      arrRoles.forEach(role => {
        checkRoles.push(role);
      });
    } else {
      checkRoles.push(authorisedRoles);
    }

    let userIsCool = false;
    // Do we have authority
    if (userDetails.role) {
      userDetails.role.forEach(userRole => {
        if (checkRoles.find(checkRole => checkRole === userRole)) {
          // User Authoirised
          userIsCool = true;
        }
      });
    }
    return userIsCool;
  };

  // return a middleware
  return (req: Request, res: Response, next: NextFunction) => {
    if (req['userDetails'] && isAllowed(req['userDetails'])){ 
      // role is allowed, so continue on the next middleware
      next();
    }
    else {
        res.status(403).json({ message: "Forbidden" }); // user is forbidden
    }
  };
}
