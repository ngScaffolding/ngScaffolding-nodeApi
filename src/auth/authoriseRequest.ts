import { Router, Request, Response, NextFunction } from 'express';
import { BasicUser } from '../models/index';
var jwt = require('jsonwebtoken');

require('dotenv').config();

export default async function authoriseRequest(req: Request, res: Response, next: NextFunction) {
  // Get token from request
  let apiToken = req.headers['authorization'];

  if (apiToken) {
    // Remove Bearer bit
    apiToken = apiToken.replace('Bearer ', '');

    // Validate & Decode Token
    try {
      let jwtDetails = jwt.decode(apiToken);

      // Setup UserDetailsModel from Token Details
      let userDetails: BasicUser = { ...jwtDetails };
      userDetails.userId = jwtDetails[process.env.JWT_USERID_FIELD || 'sub'];

      // Add UserDetailsModel to the Request Object
      req['userDetails'] = userDetails;
    } catch (err) {
      req['userDetails'] = null;
    }
  } else {
    req['userDetails'] = null;
  }

  next();
}
