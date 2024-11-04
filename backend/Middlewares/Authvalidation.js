const zod = require('zod')

const signupvalidation = (req,res,next)=>{
    const Signupschema = zod.object({
        userName:zod.string().email(),
        password:zod.string(),
        firstName:zod.string(),
        lastName:zod.string(),
    })
    const body = req.body;
    const {success} = Signupschema.safeParse(req.body);
    if(!success)
    {
        return res.status(400).json({
            message:"Email already taken/ Incorrect inputs"
        })
    }
    next();
}

const signInvalidation = async(req,res,next)=>{
    const  SignInschema = zod.object({
        userName:zod.string().email(),
        password:zod.string(),
    })

    const {success} = SignInschema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message:"Invalid input: Please ensure all fields are correctly filled in"
        })
    }

    next();
}

// const upDateValidation = async(req,res,next)=>{
//     const updateBody = zod.object({
//         password: zod.string().optional(),
//         firstName: zod.string().optional(),
//         lastName: zod.string().optional(),
//     })
// }

module.exports = 
    {signupvalidation,
    signInvalidation}

