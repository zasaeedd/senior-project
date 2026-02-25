import bcrypt from "bcrypt";

async function hashPassword() {
    const plainPassword = "123456";  // plain password

    const hashed = await bcrypt.hash(plainPassword, 10);
    
    console.log("Hashed password");
    console.log(hashed);
} 

hashPassword();