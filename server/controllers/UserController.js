const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')
const User = require("../models/User")

module.exports = {
    me: async (req, res, next) => {
        const { user } = res.locals

        try {
            return res.json({ user: user._doc })
        } catch (error) {
            console.error(error)
            const err = {}
            err.param = `all`
            err.msg = `Something goes wrong...`
            return res.status(500).json({ error: true, errors: [err] })
        }
    },

    update: async (req, res, next) => {
        const { user } = res.locals
        const { name, password, newPassword } = req.body
    
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: true, errors: errors.array() })
            }

            user.name = name
            
            if(!!password && !!newPassword) {
                let currentUser = await User.findOne({ _id: user._id }).select('+password')

                const isComparedPassword = await bcrypt.compare(password, currentUser.password)
                if(isComparedPassword) user.password = await bcrypt.hash(newPassword, 12)
            }

            if(!!req.files.avatarFile) {
                if(!fs.existsSync('avatars')) fs.mkdirSync('avatars')
                req.files.avatarFile.mv(path.resolve('avatars', user._id + '.png'), (err) => {})
            }

            return res.json({ user: user._doc })
        } catch (error) {
            console.error(error)
            const err = {}
            err.param = `all`
            err.msg = `Something goes wrong...`
            return res.status(500).json({ error: true, errors: [err] })
        }
    },
}