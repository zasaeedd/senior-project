// This folder is for registering Teachers and Students and loggin back in


// Load the express so we can create routes for the API
const express = require("express");
// used for authentication routes
const router = express.Router();


let users = [];


// Register

// this will run when the frontend sends a POST request to register
router.post("/register", (req,res) => {

// extract user data
 const {name, email, password, role} = req.body;

 // validate input
 if (!name || !email || !password || !role){
    return res.status(400).json({message: "All fields are required"});
 }

 // check if the email exists
 const exits = users.find(u => u.email == email);
 if (exists) {
    return res.status9(400).json({message: "Email already registered"});
 }

 // if email is new, create a new user
 const newUser = { id: Date.now(), name, email, password, role};
 users.push(newUser);

 res.json({message:"USer Registered", user: newUser});

});



// Login


// same thing: this will run when the frontend calls login
 router.post("/login", (req,res)=> {

// extract email and password
 const {email, password} = req.body;

// find user in the db
 const user = users.find(u => u.email === email && u.password === password);


// if not found
 if (!user){
    return res.status(401).json({message: "Invalid email or password"}); 
 }


 // if found, we end the user info back to the frontend
 req.json({message: "Login Successful",
    user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
 });
 });


 // allows index.js to use these routes
module.exports = router;