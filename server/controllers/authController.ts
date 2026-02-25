import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/client";
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error "});
    }
};