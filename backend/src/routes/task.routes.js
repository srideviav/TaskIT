const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { createTaskSchema,updateTaskSchema } = require('../validators/task.validator');
const commentController = require('../controllers/comments.controller')

router.post('/create', authMiddleware, validate(createTaskSchema), taskController.createTask);
router.get('/get/:taskId', authMiddleware, taskController.getTaskById);
router.get('/getAll/:projectId', authMiddleware, taskController.getTasksByProjectId);
router.put('/update/:taskId', authMiddleware, validate(updateTaskSchema), taskController.updateTask);
router.delete('/delete/:taskId', authMiddleware, taskController.deleteTask);
router.put('/comments/:taskId',authMiddleware,commentController.addComment);

module.exports = router;