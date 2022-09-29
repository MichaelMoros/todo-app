const pool = require('../db')

module.exports = async (req, res, next) => {
    const path = req.params.path
    const todo_id = req.params.todo_id

    if (!todo_id) {
        req.currentTodo = null
    }

    if (!path || path.length > 10) {
        req.currentPath = null
    }

    if (path) {
        const q = {
            text: 'SELECT * FROM paths WHERE path = $1',
            values: [path]
        }

        try {
            const qr = await pool.query(q)
            if (qr.rows.length === 0) req.currentPath = null
            else req.currentPath = qr.rows[0]
        } catch (e) {
            if (res.statusCode) res.status = res.statusCode
            else res.status(500)
            const error = new Error(e.message)
            next(error)
            return
        }
    }

    if (todo_id) {
        const q = {
            text: 'SELECT * FROM todos WHERE id = $1',
            values: [todo_id]
        }

        try {
            const qr = await pool.query(q)
            if (qr.rows.length === 0) req.currentTodo = null
            else req.currentTodo = qr.rows[0]
        } catch (e) {
            if (res.statusCode) res.status = res.statusCode
            else res.status(500)
            const error = new Error(e.message)
            next(error)
            return
        }
    }

    next()
}