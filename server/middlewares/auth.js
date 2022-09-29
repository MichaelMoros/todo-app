const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    if (req?.currentPath?.requireauth) {
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1]

                const decoded = jwt.verify(token, process.env.JWT_SECRET)

                const a = decoded.path
                const b = req?.currentPath?.path
                const c = req?.currentTodo?.path_id

                if (req?.currentTodo && req?.currentPath) {
                    if (a !== b || a !== c || b !== c) {
                        res.status(403)
                        const error = new Error('Unauthorized')
                        next(error)
                        return
                    }
                }

                else if (req?.currentPath) {
                    if (a !== b) {
                        res.status(403)
                        const error = new Error('Unauthorized')
                        next(error)
                        return
                    }
                }

                else {
                    if (a !== c) {
                        res.status(403)
                        const error = new Error('Unauthorized')
                        next(error)
                        return
                    }
                }

                req.auth = decoded
            } catch (e) {
                res.status(403)
                const error = new Error(e.message)
                next(error)
                return
            }
        } else {
            res.status(401)
            const error = new Error('Unauthorized')
            next(error)
            return
        }
    }


    next()
}