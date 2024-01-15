const router = require('express').Router()
const { body } = require('express-validator')
const AuthController = require('../controllers/AuthController')

router.post('/login',
    body('email')
        .isEmail().withMessage('Should be email'),
    body('password')
        .notEmpty().withMessage('Password must be not empty'), 
AuthController.login)

router.post('/register',
    body('name')
        .notEmpty().withMessage('Name must be not empty'),
    body('email')
        .isEmail().withMessage('Should be email'),
    body('password')
        .notEmpty().withMessage('Password must be not empty'),
    body('birthday')
        .isDate().withMessage('Birthday should be date'),
    body('sex')
        .isIn([ 'male', 'female' ]).withMessage('Sex should be "Male" or "Female"'),
    body('avatarFile')
        .custom((value, { req }) => {
            return req.files.avatarFile.mimetype === 'image/png'
        }).withMessage('Should be a "PNG" image'),
AuthController.register)

module.exports = router