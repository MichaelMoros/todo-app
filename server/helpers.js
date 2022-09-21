const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const generateJWT = (path) => {
    try {
        const token = jwt.sign({ path }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return token
    } catch (error) {
        return null
    }
}

const verifyJWT = async (token, path) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if (decoded?.path === path) return true
        else false
    } catch (error) {
        return false
    }
}

const generateEncryptedPassword = async (password) => {
    try {
        const result = await bcrypt.hash(password, 10)
        return result
    } catch (error) {
        return null
    }
}

const verifyEncryptedPassword = async (password, storedPassword) => {
    try {
        const result = await bcrypt.compare(password, storedPassword)
        return result
    } catch (error) {
        return false
    }
}

module.exports = {
    generateJWT,
    verifyJWT,
    generateEncryptedPassword,
    verifyEncryptedPassword
}