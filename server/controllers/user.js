import User from "./../models/User.js";

const postSignup= async (req, res)=>{
 const {name, email, password}=req.body;

 if(!name || !email || !password){
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    }); 
 }

 const emailValidationRegex= /^[^@]+@[^@]+\.[^@]+$/;
 const namevaildationRegex= /^[a-zA-Z ]+$/;
 const passwordValidationRegex= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


 if(namevaildationRegex.test(name)===false){
    return res.status(400).json({
        success:false,
        message:"Name must be 2-30 characters long and contain only letters and spaces"
    }); 
 }
    if(emailValidationRegex.test(email)===false){     
    return res.status(400).json({
        success:false,
        message:"Email fields are required"
    }); 
 }
    if(passwordValidationRegex.test(password)===false){
    return res.status(400).json({
        success:false,
        message:"Password must be at least 8 characters long and contain at least one letter and one number"
    }); 
 }

const existingUser= await User.findOne({email});
if(existingUser){
    return res.status(400).json({
        success:false,
        message:`User with this email ${email} already exists`,
    });
}

const newUser= new User ({name, email, password});

const savedUser = await newUser.save();

res.json({
    success:true,
    message:"User registered successfully",
    user:savedUser
});

};

const postLogin= async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Email and Password are required"
        });
    }
    const existingUser= await User.findOne({email, password});
    if(existingUser){
        return res.json({
            success:true,
            message:"User logged in successfully",
            user:existingUser
        });
    }
        else{
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
    }
    
};

export {postSignup, postLogin};