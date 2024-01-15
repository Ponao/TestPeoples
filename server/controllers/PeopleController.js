const User = require("../models/User")

module.exports = {
    get: async (req, res, next) => {
        const { user } = res.locals

        try {
            let users = await User.find({ _id: { $nin: [ user._id ] } })

            return res.json({ users })
        } catch (error) {
            console.error(error)
            const err = {}
            err.param = `all`
            err.msg = `Something goes wrong...`
            return res.status(500).json({ error: true, errors: [err] })
        }
    },
}