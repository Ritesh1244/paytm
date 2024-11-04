const bcrypt = require('bcryptjs');  
const JWT_SECRET = require('../config');
const jwt = require('jsonwebtoken');
const zod = require('zod')
const {User,Account} = require('../Models/paytm'); // Adjust the path as needed


const signup = async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ userName });
        
        if (existingUser) {  
            return res.status(409).json({
                message: "Username already taken / Incorrect inputs"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            password: hashedPassword,
            firstName,
            lastName
        });

        await newUser.save();

        //--------------Account------------------------
        await Account.create({
            user: newUser._id,  
            balance: 1 + Math.random() * 10000
        });
        //--------------------------

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

        res.status(201).json({
            message: "Sign-Up Successful",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during sign-up",
            error: error.message
        });
    }
};


const SignIn = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(403).json({
                message: "Authentication failed: email or password is incorrect",
                success: false
            });
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);

        if (!isPasswordEqual) {
            return res.status(403).json({
                message: "Authentication failed: email or password is incorrect",
                success: false
            });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);


        res.status(201).json({
            message: "Sign-IN Successful",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during sign-in",
            error: error.message
        });
    }
};

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

const upDate = async (req, res) => {
    // Parse and validate `req.body` with Zod
    const parseResult = updateBody.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(411).json({
            message: "Error while updating the user",
        });
    }

    const validatedData = parseResult.data;

    try {
        
        await User.updateOne({ _id: req.userId }, validatedData);
        res.json({
            message: "Updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const allUser = async(req,res) =>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
                {
                   firstName: { "$regex": filter }
                },
                {
                   lastName: { "$regex": filter }
                }
             ]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
}

module.exports = { signup,
    SignIn,upDate,allUser
};
