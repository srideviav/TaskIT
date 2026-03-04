const taskServices = require('../services/task.services');
const { getIO } = require('../config/socket.config');

exports.createTask = async (req, res, next) => {
    try {
        const taskData = req.body;
        const newTask = await taskServices.createTask(taskData);
        const io = getIO();
        io.to(newTask.projectId.toString()).emit('taskCreated', newTask);
        console.log('Emitted taskCreated event for task:', newTask._id);
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        });
    } catch (error) {
        next(error);
    }
}

exports.getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const task = await taskServices.getTaskById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
}

exports.getTasksByProjectId = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await taskServices.getTasksByProjectId(projectId);
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        const isTaskExist = await taskServices.getTaskById(req.params.taskId);
        if (!isTaskExist) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await taskServices.updateTask(
            req.params.taskId,
            req.body,
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const io = getIO();
        io.to(updatedTask.projectId.toString()).emit('taskUpdated', updatedTask);
        console.log('Emitted taskUpdated event for task:', updatedTask._id);
        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const deletedTask = await taskServices.deleteTask(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const io = getIO();
        io.to(deletedTask.projectId.toString()).emit('taskDeleted', deletedTask);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
}