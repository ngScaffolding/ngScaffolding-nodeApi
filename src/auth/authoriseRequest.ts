import { Router, Request, Response, NextFunction } from "express";
import { BasicUser } from "@ngscaffolding/models";
var jwt = require('jsonwebtoken');

require('dotenv').config();

export default async function authoriseRequest(req: Request, res: Response, next: NextFunction) {
    // Get token from request
    let apiToken = req.headers['authorization'];

    if(!apiToken){ 
        req['userDetails'] = null;
        res.send(401);
        return;
     }

     // Remove Bearer bit
    apiToken = apiToken.replace('Bearer ','');

    // Validate & Decode Token
    try{
        let jwtDetails = jwt.verify(apiToken, process.env.JWT_SECRET_FOR_ACCESS_TOKEN);

        var current_time = Date.now().valueOf();
        if (jwtDetails.exp < current_time) {
            req['userDetails'] = null;
            res.send(401);
            return;
        }
        
        // Setup UserDetailsModel from Token Details
        let userDetails: BasicUser = {...jwtDetails};

        // Add UserDetailsModel to the Request Object
        req['userDetails'] = userDetails;
    
    }
    catch (err) {
        req['userDetails'] = null;
        res.send(401);
        return;
    }
        
    next();
}

