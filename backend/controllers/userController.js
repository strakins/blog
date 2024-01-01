const HttpError = require("../models/errorModels");
const bcrypt = require('bcryptjs');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken')


// ==== Register new user .... api/user/register.... unprotected

const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password) {
            return next(new HttpError("Fill in all Fields", 422))
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail})
        if(emailExists) {
            return next(new HttpError('Email Already Exists', 422))
        }

        if((password.trim()).length < 6) {
            return next(new HttpError("Password Should be at least 6 characters", 422))
        }

        if(password != password2) {
            return next(new HttpError("Password Does not match", 422))
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, password: hashedPassword});
        res.status(201).json(`New user ${newUser.email} registered.`)

    } catch (error) {
        return next(new HttpError("User registration failed.", 422))
    }
}


// ==== Login a Registered User .... api/user/login.... unprotected
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Fill all fields.", 422))
        }
        
        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail})
        if(!user) {
            return next(new HttpError("Invalid Credentials", 422))
        }
        
        const comparePassword = await  bcrypt.compare(password, user.password)
        if(!comparePassword) {
            return next(new HttpError("Invalid Credentials", 422))
        }

        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"})

        res.status(200).json({token, id, name})
    } catch (error) {
        return next(new HttpError("Login Failed. Please Check your credentials", 422))
    }
}




// ==== get Regisetered User .... api/users/:id.... Protected
const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user) {
            return next(new HttpError(error), 404)
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}






// ==== get Reguser .... api/users/change-avatar.... Protected
const changeAvatar = async (req, res, next) => {
    res.json("User Avatar Changed");
}








// ==== Update Reguser .... api/users/:id/edit.... Protected

const updateUser = async (req, res, next) => {
    res.json("User Account Updated");
}








// ==== Get Authors.... api/users/authors.... Unprotected

const getAuthors = async (req, res, next) => {
    res.json("Authors List");
}








// ==== Delete  user .... api/users/:id/delete.... Protected

const deleteUser = async (req, res, next) => {
    res.json("User Account Deleted");
}


module.exports = { registerUser, getUser, loginUser, changeAvatar, updateUser, getAuthors, deleteUser }