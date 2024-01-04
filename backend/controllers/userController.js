const HttpError = require("../models/errorModels");
const bcrypt = require('bcryptjs');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid')

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
    try {
        if(!req.files.avatar) {
            return next(new HttpError("Please Choose an Image.", 422))
        }

        // Find user from db
        const user = await User.findById(req.user.id)
        // Delete Avatar
        if(user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if(err) {
                    return next(new HttpError(err))
                }
            })
        }
        const {avatar} = req.files
        // check file size
        if(avatar.size > 500000) {
            return next(new HttpError("Profile picture too large"), 422)
        }

        let fileName;
        fileName = avatar.name;
        let splittedFileName = fileName.split('.');
        let newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];
        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if(err) {
                return next(new HttpError(err))
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new: true})
            if(!updatedAvatar) {
                return next(new HttpError('Avatar can be Updated', 422))
            }
            res.status(200).json(updatedAvatar)
        })
    } catch (error) {
        return next(new HttpError(error));
    }
}


// ==== Update Reguser .... api/users/:id/edit.... Protected

const updateUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword ) {
            return next(new HttpError("Fill in all Fields"))
        }

        // get user from db
        const user = await User.findById(req.user.id);
        if(!user) {
            return next(new HttpError("User Not Found", 403))
        }

        // Ensure new email doesn't exists
        const emailExists  = await User.findOne({email});
        if(emailExists && (emailExists._id != req.user.id)) {
            return next(new HttpError("Email Already registered", 422))
        }

        // Compare current passwords to db password
        const validatePassword = await bcrypt.compare(currentPassword, user.password);
        if(!validatePassword) {
            next(new HttpError("Current Password is not correct", 422));
        }

        // Compare newPassword
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError("New Passwords do not match", 422));
        }
        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashpass = await bcrypt.hash(newPassword, salt);

        // Update user info
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password:hashpass}, {new: true})
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }


}


// ==== Get Authors.... api/users/authors.... Unprotected

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error), 422)
    }
}


// ==== Delete  user .... api/users/:id/delete.... Protected

const deleteUser = async (req, res, next) => {
    res.json("User Account Deleted");
}


module.exports = { registerUser, getUser, loginUser, changeAvatar, updateUser, getAuthors, deleteUser }