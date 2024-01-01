const {Router} = require('express');

const { registerUser, getUser, loginUser, changeAvatar, updateUser, getAuthors, deleteUser } = require('../controllers/userController')

const router = Router();

// Test Route sha...
router.get('/', (req, res, next) => {
    res.json("This is user Route")
})

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', changeAvatar);
router.patch('edit-user', updateUser)


module.exports = router
