const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const validate = require('../middlewares/validate.middleware');
const { createProjectSchema,updateProjectSchema } = require('../validators/project.validator');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create', authMiddleware, validate(createProjectSchema), projectController.createProject);
router.get('/get/:projectId', authMiddleware, projectController.getProjectById);
router.get('/getAll/:userId', authMiddleware, projectController.getAllProjectsByUserId);
router.put('/update/:projectId',validate(updateProjectSchema), authMiddleware,   projectController.updateProject);
router.delete('/delete/:projectId', authMiddleware, projectController.deleteProject);

module.exports = router;