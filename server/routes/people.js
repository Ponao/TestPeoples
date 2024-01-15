const router = require('express').Router()
const verifyToken = require('../middleware/verifyToken')
const PeopleController = require('../controllers/PeopleController')

router.get('/get', verifyToken, PeopleController.get)

module.exports = router