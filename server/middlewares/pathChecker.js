const pool = require('../db')

module.exports = async (req, res, next) => {
    const path = req.params.path

    if (!path || path.length > 10) {
        res.status(400)
        const error = new Error('Path must be between 1-10 characters only')
        next(error)
        return
    }

    const findPathQuery = {
        text: 'SELECT * FROM paths WHERE path = $1',
        values: [path]
    }

    try {
        const findPathQueryResult = await pool.query(findPathQuery)
        if (findPathQueryResult.rows.length === 0) {
            req.currentPath = null
        } else {
            req.currentPath = findPathQueryResult.rows[0]
        }

        next()
    } catch (findPathQueryError) {
        if (res.statusCode) res.status = res.statusCode
        else res.status(500)
        const error = new Error(findPathQueryError.message)
        next(error)
        return
    }
}