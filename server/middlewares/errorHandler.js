module.exports = ((err, req, res, next) => {
    let code = res.statusCode ? res.statusCode : 500
    return res.json({
        error: {
            code,
            message: err.message
        }
    })
})