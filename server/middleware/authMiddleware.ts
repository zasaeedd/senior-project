import {Request,Response, NextFunction} from "express";
import {verifyToken} from "../utils/jwt";
// import { Response } from "openai/_shims/registry.mjs";

// extend express request interface to add userId to extract from token
declare global {
    namespace Express {
        interface Request {
            userId?: string; // optional custom property
        }
    }
}

// authenticate user by token
export const authenticate = (req: Request, res: Response, next: NextFunction) =>  {
    try {
        const authHeader = req.headers.authorization;

        // if there is no Bearer token then authorization is not granted
        if(!authHeader || !authHeader.startsWith("Bearer")) {
            // send 401 (Unauthorized) error msg
            return res.status(401).json({message: "No token provided"});
        }

        // remove Bearer prefix -> Authorization: `Bearer ${token}`
        const token = authHeader.substring(7);

        const decoded = verifyToken(token) as {userId: string};
        req.userId = decoded.userId;
        next(); // go to the next handler func

    } catch {
        return res.status(401).json({message: "Invalid or expired token"});
    }
};