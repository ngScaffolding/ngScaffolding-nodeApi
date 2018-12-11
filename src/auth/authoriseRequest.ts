import { Router, Request, Response, NextFunction } from "express";
import { BasicUser } from "@ngscaffolding/models";
var jwt = require('jsonwebtoken');

require('dotenv').config();

export default async function authoriseRequest(req: Request, res: Response, next: NextFunction) {
    // Get token from request
    let apiToken = req.headers['authorization'];

    if(!apiToken){ 
        req['userDetails'] = null;
        return;
     }

     // Remove Bearer bit
    apiToken = apiToken.replace('Bearer ','');

    // where no Token, allow access but no user Details
    if (!apiToken) return res.status(401).send({ message: 'No token provided.' });

    // Validate & Decode Token
    try{
        let jwtDetails = jwt.verify(apiToken, process.env.JWT_SECRET_FOR_ACCESS_TOKEN);

        var current_time = Date.now().valueOf();// / 1000;
        if ( jwtDetails.exp < current_time) {
            res.status(401).send({ message: 'Token Expired' });
        }
        
        // Setup UserDetailsModel from Token Details
        let userDetails: BasicUser = {...jwtDetails};

        // Add UserDetailsModel to the Request Object
        req['userDetails'] = userDetails;
    
    }
    catch(err){
        return res.status(401).send({ message: 'Invalid Token' });
    }
        
    next();
}

