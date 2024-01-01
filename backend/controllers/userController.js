// ==== Register new user .... api/user/register.... unprotected

const registerUser = (req, res, next) => {
    res.json("Register User");
}


// ==== Login a Reguser .... api/user/login.... unprotected
const loginUser = (req, res, next) => {
    res.json("User Login Success");
}

// ==== get Reguser .... api/users/:id.... Protected
const getUser = (req, res, next) => {
    res.json("User Profile");
}



// ==== get Reguser .... api/users/change-avatar.... Protected
const changeAvatar = (req, res, next) => {
    res.json("User Avatar Changed");
}


// ==== Update Reguser .... api/users/:id/edit.... Protected

const updateUser = (req, res, next) => {
    res.json("User Account Updated");
}




// ==== Update Reguser .... api/users/authors.... Unprotected

const getAuthors = (req, res, next) => {
    res.json("Authors List");
}


// ==== Delete  user .... api/users/:id/delete.... Protected

const deleteUser = (req, res, next) => {
    res.json("User Account Deleted");
}


module.exports = { registerUser, getUser, loginUser, changeAvatar, updateUser, getAuthors, deleteUser }