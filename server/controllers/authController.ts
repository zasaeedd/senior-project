// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { prisma } from '../prisma/prisma.config';
// import { generateToken } from "../utils/jwt";

// export const login = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body;

//         // we Find the user by email
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });
//         // console.log("User from DB:", user);


//         if (!user){
//             return res.status(401).json({ message: "Invalid credentials"});
//         }

//         // we compare passwordss
//         const isPassValid = await bcrypt.compare(password, user.password);
//         if (!isPassValid) {
//             return res.status(401).json({message : "Invalid creditials "});
//         }
        
//         // generate JWT token with user id and role
//         const token = generateToken(user.userId.toString());

//         // we respond with user info and token
//         res.json({
//             id: user.userId,
//             email: user.email,
//             role: user.role, 
//             token
//         });
//     } catch (err: any) {
//         console.error("Login full error:", err); //  print in terminal
//         res.status(500).json({ message: err.message, stack: err.stack }); //  return full error in Postman
//     }
// };



// import { createClient } from "@supabase/supabase-js";


// // For normal sign-in (use anon key)
// const supabaseClient = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// // For admin operations (use service role key)
// const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Find the user by email
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 2. Compare passwords
//     const isPassValid = await bcrypt.compare(password, user.password);
//     if (!isPassValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 3. Generate your own JWT
//     const token = generateToken(user.userId.toString());

//     // 4. Create Supabase session for this user
//     // Important: user must exist in Supabase Auth too (with a matching ID/email)
//     const { data, error } = await supabaseAdmin.auth.signInWithPassword({
//       email: user.email,
//       password: password, // store this in your DB when you create the user in Supabase
//     });

//     if (error) {
//       console.error("Supabase session error:", error);
//       return res.status(500).json({ message: "Failed to create Supabase session" });
//     }

//     // 5. Respond with both tokens
//     res.json({
//       id: user.userId,
//       email: user.email,
//       role: user.role,
//       token, // your backend JWT
//       supabaseAccessToken: data.session.access_token,
//       supabaseRefreshToken: data.session.refresh_token,
//     });
//   } catch (err: any) {
//     console.error("Login full error:", err);
//     res.status(500).json({ message: err.message, stack: err.stack });
//   }
// };
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prisma.config';
import { generateToken } from "../utils/jwt";
import { createClient } from "@supabase/supabase-js";


// For normal sign-in (use anon key)
const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// For admin operations (use service role key)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in your own DB
    const user = await prisma.appUser.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate your own JWT
    const token = generateToken(user.userId.toString());

    // 4. Branch by role
    if (user.role === "student") {
      // Students only get your JWT
      return res.json({
        id: user.userId,
        email: user.email,
        role: user.role,
        token,
      });
    }

    if (user.role === "instructor") {
      // Instructors get JWT + Supabase session
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (error) {
        console.error("Supabase session error:", error);
        return res.status(500).json({ message: "Failed to create Supabase session" });
      }

      return res.json({
        id: user.userId,
        supabaseId: user.supabaseId,
        email: user.email,
        role: user.role,
        token,
        supabaseAccessToken: data.session?.access_token,
        supabaseRefreshToken: data.session?.refresh_token,
      });
    }

    // fallback if role is something else
    return res.status(403).json({ message: "Unsupported role" });
  } catch (err: any) {
    console.error("Login full error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};




// get the current user's data from userid
export const getCurrentUser = async (req: Request, res: Response) => {
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({message: "Unauthorized"});
        }

        // const user = await prisma.user.findUnique({
        //     where: {userId: parseInt(userId)},
        //     include:{
        //         instructor: {
        //             include: {
        //                 section: {
        //                     include: {
        //                         course: true,
        //                         _count: {
        //                             select: {enrollments: true}
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         student: true
        //     }
        //     // select: {
        //     //     userId: true,
        //     //     firstName: true,
        //     //     lastName: true,
        //     //     email: true,
        //     //     role: true,
            
        // });

        const user = await prisma.appUser.findUnique({
  where: { userId: parseInt(userId) },
  include: {
    instructor: {
      include: {
        section: {
          include: {
            course: true,
            _count: {
              select: { enrollments: true }
            }
          }
        }
      }
    },
    student: {
      include: {
        enrollments: {
          include: {
            section: {
              include: { course: true }
            }
          }
        }
      }
    }
  }
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
