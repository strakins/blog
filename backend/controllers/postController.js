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
        if(!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and Choose Thumbnails", 422))
        }
        const {thumbnail} = req.files;
        // check file size
        if(thumbnail.size > 3000000) {
            return next(new HttpError("Blog Thumbnail too large, File should be less than 3mb"), 422)
        }
        let fileName = thumbnail.name;
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, category, description, thumbnail: newFileName, creator: req.user.id})
                if(!newPost) {
                    return next(new HttpError('Post Could not be created', 422))
                }
                // Find User and Increase post count by 1
                const currentuser = await User.findById(req.user.id);
                const userPostCount = currentuser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ======== Get All Posts api/posts ..... GET
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ======== Get Single Post api/posts/:id
const getSinglePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if(!post) {
            return next(new HttpError("Post not Found.", 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ======== Get Posts By Category api/posts/categories/:category
const getPostCat = async (req, res, next) => {
    try {
        const {category} = req.params;
        const postCat = await Post.find({category}).sort({createdAt: -1});
        res.status(200).json(postCat)
    } catch (error) {
        return next(new HttpError("category can not be found", 404))
    }
}

// ======== Get Posts By Author 
// Protected api/posts/posts/:id
const getAuthorPost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1});
        res.status(200).json(posts)

    } catch (error) {
        return next(new HttpError("Can not fetch Invalid Post Author", 404))
    }
}

// ======== Patch Post api/posts/:id/edit
// Protected
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title, category, description} = req.body;

        if(!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields and Choose Thumbnails", 422))
        }
        // get old post 4m database
        const oldPost = await Post.findById(postId);
        if(req.user.id == oldPost.creator) {
            if(!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true})
            }else {
                // delete old thumbnail
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if(err) {
                        return next(new HttpError(err));
                    }
                })
                // check size
                const {thumbnail} = req.files;
                if(thumbnail.size > 3000000) {
                    return next(new HttpError("Thumbnail too large, File should be less than 3mb"), 422)
                }
                let fileName = thumbnail.name;
                let splittedFileName = fileName.split('.')
                let newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1]
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
                    if(err) {
                        return next(new HttpError(err))
                    }
                });
    
                updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFileName}, {new: true});
                
                if(!updatedPost) {
                    return next(new HttpError("Could not update post", 400))
                }
    
                res.status(200).json(updatedPost)
            }
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}



// ======== Delete Post api/posts/:id/delete
// Protected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if(!postId) {
            return next(new HttpError("Post Unavailable", 400))
        }
        // check for thumbnail, then delete
        const post = await Post.findById(postId)
        const fileName = post?.thumbnail;
        if(req.user.id == post.creator) {

            // delete thumbnails from uploads folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if(err) {
                    return next(new HttpError(err))
                }else {
                    await Post.findByIdAndDelete(postId);
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
                }
            })
        } else {
            return next(new HttpError("Post could not be deleted", 403))
        }
        res.json(`Post ${postId} deleted Successfully`)
    } catch (error) {
        return next(new HttpError("Could not delete", 422))
    }
}


module.exports = { createPost, getAllPosts, getSinglePost, getPostCat, getAuthorPost, editPost, deletePost }





