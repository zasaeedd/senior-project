import {verifyToken} from "../utils/jwt";
import { supabaseAuth } from "../supabassClient";
// import { Response } from "openai/_shims/registry.mjs";
import { Request, Response, NextFunction } from "express";

// extend express request interface to add userId to extract from token
declare global {
    namespace Express {
        interface Request {
            userId?: string; // optional custom property
        }
    }
}

// authenticate user by token
// export const authenticate = (req: Request, res: Response, next: NextFunction) =>  {
//     try {
//         const authHeader = req.headers.authorization;

//         // if there is no Bearer token then authorization is not granted
//         if(!authHeader || !authHeader.startsWith("Bearer")) {
//             // send 401 (Unauthorized) error msg
//             return res.status(401).json({message: "No token provided"});
//         }

//         // remove Bearer prefix -> Authorization: `Bearer ${token}`
//         const token = authHeader.substring(7);

//         const decoded = verifyToken(token) as {userId: string};
//         req.userId = decoded.userId;
//         next(); // go to the next handler func

//     } catch {
//         return res.status(401).json({message: "Invalid or expired token"});
//     }
// };

// supabaseAuthMiddleware.ts
export const supabaseAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ message: "Invalid or expired Supabase token" });
  }
  req.userId = user.id;
  next();
};

// jwtAuthMiddleware.ts
export const jwtAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header received:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = verifyToken(token) as { userId: string };
    console.log("Decoded token:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired JWT" });
  }
};
