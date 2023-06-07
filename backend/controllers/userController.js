import asyncHandler from 'express-async-handler';
import {User} from '../models/userModel.js';
import { generateToken } from '../utils/generateTokens.js';

//@desc    Auth User/set token
//route    Post /api/users/auth
//@access  Public
const authUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }   
});

//@desc    Register User/set token
//route    Post /api/users/register
//@access  Public
const registerUser = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
        console.log(User);
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
    
});

//@desc    Logout User/set token
//route    Post /api/users/logout
//@access  Public
const logoutUser = asyncHandler(async (req, res)=>{
    res.cookie('jwt', '',{
        httpOnly: true,
        expires: new Date(0)
    } )
    res.status(200).json({message: "User Logged Out"});
});

//@desc    Get User Profile
//route    GET /api/users/profile
//@access  Private
const getUserProfile = asyncHandler(async (req, res)=>{
    const user = req.user;
    // console.log(user);
    res.status(200).json({user});
});


//@desc    Update User Profile
//route    PUT /api/users/profile
//@access  Private
const updateUserProfile = asyncHandler(async (req, res)=>{
    const user = await User.findOne({_id: req.user._id});
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,

        })
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
});
export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}