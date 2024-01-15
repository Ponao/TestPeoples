const fs = require('fs')
const path = require('path')
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator')
const User = require("../models/User")
const bcrypt = require('bcryptjs')

module.exports = {
    login: async (req, res, next) => {    
        const { email, password } = req.body
        const cleanEmail = email.toLowerCase().replace(/\s+/g, '')

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: true, errors: errors.array() })
            }

            const user = await User.findOne({ email: cleanEmail }).select('+password')
            if(!!user) {
                const isComparedPassword = await bcrypt.compare(password, user.password)
                if(isComparedPassword) {
                    let safeUser = user.toObject()
                    delete safeUser.password

                    const token = generateToken(String(safeUser._id))

                    return res.json({ user: safeUser, token })
                }
            }

            const err = {}
            err.param = `all`
            err.msg = `Email or password wrong`
            return res.status(401).json({ success: false, errors: [err] })
        } catch(error) {
            console.error( error)
            const err = {}
            err.param = `all`
            err.msg = `Something goes wrong...`
            return res.status(500).json({ error: true, errors: [ err ] })
        }
    },

    register: async (req, res, next) => {    
        const { name, email, password, birthday, sex } = req.body
        const cleanEmail = email.toLowerCase().replace(/\s+/g, '')

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: true, errors: errors.array() })
            }

            let existUser = await User.findOne({ email: cleanEmail })
            if(!!existUser) {
                const err = {}
                err.param = `all`
                err.msg = `Email already taken.`
                return res.status(409).json({ error: true, errors: [ err ] })
            }
            
            let newUser = await new User({
                name,
                email: cleanEmail,
                password: await bcrypt.hash(password, 12),
                birthday,
                sex
            }).save()

            let safeUser = newUser.toObject()
            delete safeUser.password

            const token = generateToken(String(safeUser._id))

            if(!fs.existsSync('avatars')) fs.mkdirSync('avatars')

            req.files.avatarFile.mv(path.resolve('avatars', safeUser._id + '.png'), (err) => {})
            
            return res.json({ user: safeUser, token })
        } catch(error) {
            console.error(error)
            const err = {}
            err.param = `all`
            err.msg = `Something goes wrong...`
            return res.status(500).json({ error: true, errors: [ err ] })
        }
    },
}

function generateToken(userId) {
    return jwt.sign(
        userId,
        process.env.JWT_SECRET
    )
}