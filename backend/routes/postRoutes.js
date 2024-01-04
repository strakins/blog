const {Router} = require('express');
const authCheck = require('../middleware/authMiddleware')
const { createPost, getAllPosts, getSinglePost, getPostCat, getAuthorPost, editPost, deletePost } = require('../controllers/postController')


const router = Router()

router.post('/create', authCheck, createPost)
router.get('/', getAllPosts)
router.get('/:id', getSinglePost)
router.get('/categories/:category', getPostCat)
router.get('/users/:id', getAuthorPost)
router.patch('/:id', authCheck, editPost)
router.delete('/:id', authCheck, deletePost)


module.exports = router 