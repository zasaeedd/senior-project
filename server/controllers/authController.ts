import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prisma.config';
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // we Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user){
            return res.status(401).json({ message: "Invalid credentials"});
        }

        // we compare passwordss
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({message : "Invalid creditials "});
        }
        
        // generate JWT token with user id and role
        const token = generateToken(user.userId.toString());

        // we respond with user info and token
        res.json({
            id: user.userId,
            email: user.email,
            role: user.role, 
            token
        });
    } catch (err: any) {
        console.error("Login full error:", err); //  print in terminal
        res.status(500).json({ message: err.message, stack: err.stack }); //  return full error in Postman
    }
};




// get the current user's data from userid
export const getCurrentUser = async (req: Request, res: Response) => {
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({message: "Unauthorized"});
        }

        const user = await prisma.user.findUnique({
            where: {userId: parseInt(userId)},
            include:{
                instructor: {
                    include: {
                        section: {
                            include: {
                                course: true,
                                _count: {
                                    select: {enrollments: true}
                                }
                            }
                        }
                    }
                },
                student: true
            }
            // select: {
            //     userId: true,
            //     firstName: true,
            //     lastName: true,
            //     email: true,
            //     role: true,
            
        });

        if(!user) {
            return res.status(401).json({message: "User not found"});

        }

        res.json(user);
    }catch(err: any) {
        console.error("Error fetching user: ", err);
        res.status(500).json({message: err.message});
    }
}
