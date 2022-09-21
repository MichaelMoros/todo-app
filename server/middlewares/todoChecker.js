const pool = require('../db')

module.exports = async (req, res, next) => {
    const todo_id = req.params.todo_id

    if (!todo_id) {
        res.status(400)
        const error = new Error('Bad Request')
        next(error)
        return
    }

    const findTodoQuery = {
        text: 'SELECT * FROM todos WHERE id = $1',
        values: [todo_id]
    }

    try {
        const findTodoQueryResult = await pool.query(findTodoQuery)
        if (findTodoQueryResult.rows.length === 0) {
            res.status(400)
            throw new Error('Bad Request')
        }

        req.currentTodo = findTodoQueryResult.rows[0]
        next()
    } catch (findTodoQueryError) {
        if (res.statusCode) res.status = res.statusCode
        else res.status(500)
        const error = new Error(findTodoQueryError.message)
        next(error)
        return
    }
}