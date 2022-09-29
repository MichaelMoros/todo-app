const express = require("express");
const router = express.Router();
const MainController = require('../controllers/mainController')
const ParamChecker = require('../middlewares/ParamChecker');
const auth = require("../middlewares/auth");

router
    .get('/', MainController.createRandomTodo)

router
    .route('/:path')
    .get(ParamChecker, auth, MainController.createOrViewTodo)
    .post(ParamChecker, auth, MainController.createPathOrUpdatePassword)
    .delete(ParamChecker, auth, MainController.deletePath)

router
    .post('/:path/token', ParamChecker, MainController.createPathToken)

router
    .post('/:path/todo', ParamChecker, auth, MainController.createPathAndTodoOrCreateTodo)

router
    .route('/:path/todo/:todo_id')
    .put(ParamChecker, auth, MainController.updateTodo)
    .delete(ParamChecker, auth, MainController.deleteTodo)

module.exports = router;
