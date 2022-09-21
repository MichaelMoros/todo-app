const pool = require('../db')
const { generateJWT, generateEncryptedPassword, verifyEncryptedPassword, verifyJWT } = require('../helpers')

async function generateRandomPath() {
    let newPath = Math.random().toString(36).slice(2, 8)

    try {
        const query = {
            text: 'SELECT path from paths WHERE path = $1',
            values: [newPath]
        }

        const result = await pool.query(query)
        const { rows } = result
        if (rows.length > 0) generateRandomPath()
        else if (rows.length === 0) return newPath
    } catch (err) {
        const error = new Error(err.message)
        return error
    }
}

// @desc    Generate a unique random todo path
// @route   GET /:path
// @access  Public
exports.createRandomTodo = async (req, res, next) => {
    const path = await generateRandomPath()

    if (path instanceof Error) {
        next(path)
        return
    }

    res.redirect(`/${path}`)
}

// @desc    Create or view an existing todo
// @route   GET /:path
// @access  Public/Private
// @params  accessToken?<string>
exports.createOrViewTodo = async (req, res, next) => {
    const currentPath = req.currentPath
    const accessToken = req.body.accessToken || null
    const path = req.params.path

    // if path doesn't exist create a new one
    if (!currentPath) {
        const createPathQuery = {
            text: "INSERT INTO paths(path) VALUES ($1) RETURNING path, requireauth",
            values: [path]
        }

        try {
            const createPathQueryResult = await pool.query(createPathQuery)
            const newPath = createPathQueryResult.rows[0]

            res.json({
                data: {
                    path: newPath.path,
                    requireauth: newPath.requireauth,
                    todos: []
                }
            })

        } catch (createPathQueryError) {
            res.status(500)
            const error = new Error(createPathQueryError.message)
            next(error)
            return
        }
    }

    // if path exist fetch all todos like to path
    if (currentPath) {
        if (currentPath.requireauth) {
            if (!accessToken) {
                res.status(401)
                const error = new Error('Unauthorized')
                next(error)
                return
            }

            const isValidAccessToken = await verifyJWT(accessToken, currentPath.path)

            if (!isValidAccessToken) {
                res.status(403)
                const error = new Error('Forbidden')
                next(error)
                return
            }
        }

        const findTodosQuery = {
            text: 'SELECT * FROM todos WHERE path_id = $1',
            values: [currentPath.path]
        }

        const findTodosQueryResult = await pool.query(findTodosQuery)

        return res.json({
            data: {
                path: currentPath.path,
                requireauth: currentPath.requireauth,
                todos: findTodosQueryResult.rows
            }
        })
    }
}

// @desc    Generate Access Token 
// @route   GET /:path/token
// @access  Private
// @params  password<string>
exports.createPathToken = async (req, res, next) => {
    const path = req.params.path
    const password = req.body.password
    const currentPath = req.currentPath

    if (!password || password?.length > 64) {
        res.status(400)
        const error = new Error('Bad Request')
        next(error)
        return
    }

    if (!currentPath) {
        res.status(404)
        const error = new Error('Not Found')
        next(error)
        return
    }

    if (currentPath) {
        if (!currentPath.requireauth) {
            res.status(204)
            res.end()
            return
        }

        const isMatchingPassword = await verifyEncryptedPassword(password, currentPath.password)

        if (!isMatchingPassword) {
            res.status(403)
            const error = new Error('Forbidden')
            next(error)
            return
        }

        const accessToken = await generateJWT(path)

        res.json({
            data: {
                path: currentPath.path,
                requireauth: currentPath.requireauth,
                accessToken
            }
        })
    }
}


// @desc    Create new path or update existing path password
// @route   POST /:path
// @access  Public/Private
// @params  password<string>
//          accessToken?<string>
//          requireauth?<boolean>
exports.createPathOrUpdatePassword = async (req, res, next) => {
    const password = req.body.password || null
    const path = req.params.path || null
    const accessToken = req.body.accessToken || null
    const requireauth = req.body.requireauth || null
    const currentPath = req.currentPath

    if (!password || password?.length > 64) {
        res.status(400)
        const error = new Error('Either empty password or length > 64')
        next(error)
        return
    }

    if (!currentPath) {
        const encryptedPassword = await generateEncryptedPassword(password)

        const createPathQuery = {
            text: "INSERT INTO paths(path, requireauth, password) VALUES ($1, $2, $3) RETURNING *",
            values: [path, true, encryptedPassword]
        }

        try {
            const createPathQueryResult = await pool.query(createPathQuery)
            const newPath = createPathQueryResult.rows[0]
            const accessToken = await generateJWT(path)

            return res.json({
                data: {
                    path: newPath.path,
                    requireauth: newPath.requireauth,
                    accessToken,
                    todos: []
                }
            })

        } catch (createPathQueryError) {
            res.status(500)
            const error = new Error(createPathQueryError.message)
            next(error)
            return
        }
    }

    if (currentPath) {
        if (!currentPath.requireauth) {
            // update path to requireauth = true and set new password
            if (requireauth && password) {
                const userPassword = await generateEncryptedPassword(password)

                const updatePathQuery = {
                    text: 'UPDATE paths SET requireauth = $1, password = $2 WHERE path = $3',
                    values: [true, userPassword, path]
                }

                try {
                    await pool.query(updatePathQuery)
                    res.json({ message: "Operation successful" })
                } catch (updatePathQueryError) {
                    res.status(500)
                    const error = new Error(updatePathQueryError.message)
                    next(error)
                    return
                }
            }

            res.status(204)
            res.end()
            return
        }


        if (currentPath.requireauth) {
            if (!accessToken) {
                res.status(401)
                const error = new Error('Unauthorized')
                next(error)
                return
            }

            const isValidAcessToken = await verifyJWT(accessToken)

            if (!isValidAcessToken) {
                res.status(403)
                const error = new Error('Forbidden')
                next(error)
                return
            }

            // turn off requireauth
            if (requireauth === false) {
                const updateQuery = {
                    text: 'UPDATE paths SET requireauth = $1, password = $2 WHERE path = $3',
                    values: [false, null, path]
                }

                try {
                    await pool.query(updateQuery)
                    res.json({ message: 'Operation successful' })
                } catch (updateQueryError) {
                    res.status(500)
                    const error = new Error(updateQueryError.message)
                    next(error)
                    return
                }
            }

            // update password
            else if (password && requireauth) {
                const userPassword = await generateEncryptedPassword(password)
                const updatePasswordQuery = {
                    text: 'UPDATE paths set requireauth = $1, password = $2 WHERE path = $3',
                    values: [true, userPassword, path]
                }

                try {
                    await pool.query(updatePasswordQuery)
                    res.json({ message: 'Operation successful' })
                } catch (updatePasswordQueryError) {
                    res.status(500)
                    const error = new Error(updatePasswordQueryError.message)
                    next(error)
                    return
                }
            }

            res.status(204)
            res.end()
            return
        }
    }
}

// @desc    Create Path and Todo or add todo on existing path
// @route   POST /:path/todo
// @access  Public/Private
// @params  text<string>
//          accessToken?<string>
//          completed?<boolean>
exports.createPathAndTodoOrCreateTodo = async (req, res, next) => {
    const path = req.params.path || null
    const accessToken = req.body.accessToken || null
    const { text = null, completed = false } = req.body
    const currentPath = req.currentPath

    if (!text) {
        res.status(400)
        const error = new Error('Bad Request')
        next(error)
        return
    }

    // if path doesnt exist create new path and new todo
    if (!currentPath) {
        const createNewPathQuery = {
            text: 'INSERT INTO paths(path) VALUES ($1) RETURNING *',
            values: [path]
        }

        const createNewTodoQuery = {
            text: 'INSERT INTO todos(path_id, text, completed) VALUES ($1, $2, $3) RETURNING *',
            values: [path, text, completed]
        }

        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const createNewPathQueryResult = await client.query(createNewPathQuery)
            const createNewTodoQueryResult = await client.query(createNewTodoQuery)
            await client.query('COMMIT')

            res.json({
                success: true,
                data: {
                    path: createNewPathQueryResult?.rows[0]?.path,
                    requireauth: createNewPathQueryResult?.rows[0]?.requireauth,
                    todos: [
                        {
                            id: createNewTodoQueryResult?.rows[0]?.id,
                            path_id: createNewTodoQueryResult?.rows[0]?.path_id,
                            text: createNewTodoQueryResult?.rows[0]?.text,
                            completed: createNewTodoQueryResult?.rows[0]?.completed
                        }
                    ]
                }
            })

        } catch (txError) {
            res.status(500)
            const error = new Error(txError.message)
            await client.query('ROLLBACK')
            next(error)
            return
        } finally {
            client.release()
        }
    }

    // if path already exist add todo to path
    if (currentPath) {
        if (currentPath.requireauth) {
            if (!accessToken) {
                res.status(401)
                const error = new Error('Unauthorized')
                next(error)
                return
            }

            const isValidAccessToken = await verifyJWT(accessToken, currentPath.path)

            if (!isValidAccessToken) {
                res.status(403)
                const error = new Error('Forbidden')
                next(error)
                return
            }
        }

        const insertQuery = {
            text: 'INSERT INTO todos(path_id, text, completed) VALUES ($1, $2, $3) RETURNING *',
            values: [currentPath.path, text, completed]
        }

        try {
            const insertQueryResult = await pool.query(insertQuery)
            res.json({
                data: {
                    id: insertQueryResult?.rows[0]?.id,
                    path_id: insertQueryResult?.rows[0]?.path_id,
                    text: insertQueryResult?.rows[0]?.text,
                    completed: insertQueryResult?.rows[0]?.completed,
                }
            })
        } catch (insertQueryError) {
            res.status(500)
            const error = new Error(insertQueryError.message)
            next(error)
            return
        }
    }
}

// @desc    Update existing toddo
// @route   PUT /:path/todo/:todo_id
// @access  Public/Private
// @params  completed<boolean>
//          accessToken?<string>
exports.updateTodo = async (req, res, next) => {
    const currentTodo = req.currentTodo
    const currentPath = req.currentPath
    const path = req.params.path
    const { accessToken, completed } = req.body

    if (!currentPath) {
        res.status(400)
        const error = new Error('Bad Requst')
        next(error)
        return
    }

    if (currentTodo.completed === completed) {
        res.status(204)
        res.end()
        return
    }

    if (currentPath.requireauth) {
        if (!accessToken) {
            res.status(401)
            const error = new Error('Unauthorized')
            next(error)
            return
        }

        const isValidAccessToken = await verifyJWT(accessToken, currentPath.path)

        if (!isValidAccessToken) {
            res.status(403)
            const error = new Error('Forbidden')
            next(error)
            return
        }
    }

    const updateTodoQuery = {
        text: 'UPDATE todos set completed = $1 WHERE path_id = $2',
        values: [completed, currentPath.path]
    }

    try {
        await pool.query(updateTodoQuery)
        res.json({ message: "Operation successful" })
    } catch (updateTodoQueryError) {
        res.status(500)
        const error = new Error(updateTodoQueryError.message)
        next(error)
        return
    }
}


// @desc    Delete existing todo
// @route   DELETE /:path/todo/:todo_id
// @access  Public/Private
exports.deleteTodo = async (req, res, next) => {
    const currentTodo = req.currentTodo
    const currentPath = req.currentPath

    if (!currentPath) {
        res.status(400)
        const error = new Error('Bad Request')
        next(error)
        return
    }

    const deleteTodoQuery = {
        text: 'DELETE FROM todos WHERE id = $1',
        values: [currentTodo.id]
    }

    try {
        await pool.query(deleteTodoQuery)
        res.json({ message: 'Operation successful' })
    } catch (deleteTodoQueryError) {
        res.status(500)
        const error = new Error(deleteTodoQueryError)
        next(error)
        return
    }
}