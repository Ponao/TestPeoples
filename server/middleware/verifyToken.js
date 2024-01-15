const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Methods", "*")
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')

    const header = req.headers.authorization

    if((!header || !header.startsWith('Bearer'))) {
        return res.status(403).json({error: true, errors: [
            {
                param: 'all',
                msg: 'Token missing'
            }
        ]})
    }

    let token

    if(header && header.startsWith('Bearer')) {
        token = header.replace(/^Bearer /, '')
    }
    
    try {
        var userId = jwt.verify(token, process.env.JWT_SECRET)
    } catch(e) {
        return res.status(403).json({error: true, errors: [
            {
                param: 'all',
                msg: 'Token missing'
            }
        ]})
    }

    if(!userId) {
        return res.status(403).json({error: true, errors: [
            {
                param: 'all',
                msg: 'Token missing'
            }
        ]})
    }

    res.locals.user = await User.findById(userId)

    return next()
}