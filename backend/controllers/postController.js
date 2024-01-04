// ======== Create Post api/posts .... POST
// Protected
const createPost = async (req, res, next) => {
    res.json("Create Post")
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





