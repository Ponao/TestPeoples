const router = require('express').Router()
const verifyToken = require('../middleware/verifyToken')
const UserController = require('../controllers/UserController')
const { body } = require('express-validator')

router.get('/me', verifyToken, UserController.me)
router.put('/update', verifyToken, 
    body('name')
        .notEmpty().withMessage('Name must be not empty'),
    body('avatarFile')
        .custom((value, { req }) => {
            if(!req.files.avatarFile) return true
            return req.files.avatarFile.mimetype === 'image/png'
        }).withMessage('Should be a "PNG" image'),
UserController.update)

module.exports = router