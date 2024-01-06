const Post = require('../models/postModels');
const User = require('../models/userModels');
const path = require('path');
const fs = require('fs');
const {v4: uuid} = require('uuid');
const HttpError = require('../models/errorModels')



// ======== Create Post api/posts .... POST
// Protected
const createPost = async (req, res, next) => {
    try {
        let {title, category, description} = req.body;
        if(!title || !category || !description || req.files) {
            return next(HttpError("Fill in all fields and Choose Thumbnails", 422))
        }
        const {thumbnial} = req.files;
        // check file size
        if(thumbnial.size > 3000000) {
            return next(new HttpError("Blog Thumbnail too large, File should be less dan 3mb"), 422)
        }

    } catch (error) {
        return next(new HttpError(error))
    }
}



// ======== Get All Posts api/posts ..... GET
const getAllPosts = async (req, res, next) => {
    res.json("Get All Post")
}



// ======== Get Single Post api/posts/:id
const getSinglePost = async (req, res, next) => {
    res.json("Single Post")
}




// ======== Get Posts By Category api/posts/categories/:category
const getPostCat = async (req, res, next) => {
    res.json("Get Post Category")
}



// ======== Get Posts By Author 
// Protected api/posts/posts/:id
const getAuthorPost = async (req, res, next) => {
    res.json("Authors  Post")
}



// ======== Patch Post api/posts/:id/edit
// Protected
const editPost = async (req, res, next) => {



    res.json("Edit Post")
}



// ======== Delete Post api/posts/:id/delete
// Protected
const deletePost = async (req, res, next) => {
    res.json("Delete Post")
}


module.exports = { createPost, getAllPosts, getSinglePost, getPostCat, getAuthorPost, editPost, deletePost }





