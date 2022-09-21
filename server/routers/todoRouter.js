const express = require("express");
const router = express.Router();
const MainController = require('../controllers/mainController')
const PathValidator = require('../middlewares/pathChecker')
const TodoChecker = require('../middlewares/todoChecker')

router
    .get('/', MainController.createRandomTodo)

router
    .route('/:path')
    .get(PathValidator, MainController.createOrViewTodo)
    .post(PathValidator, MainController.createPathOrUpdatePassword)

router
    .post('/:path/token', PathValidator, MainController.createPathToken)

router
    .post('/:path/todo', PathValidator, MainController.createPathAndTodoOrCreateTodo)

router
    .route('/:path/todo/:todo_id')
    .put(PathValidator, TodoChecker, MainController.updateTodo)
    .delete(PathValidator, TodoChecker, MainController.deleteTodo)

module.exports = router;
