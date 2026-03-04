const Task = require('../models/task.model');

exports.createTask = async (taskData) => {
    const newTask = new Task(taskData);
    return await newTask.save();
}
exports.getTaskById = async (taskId) => {
    const task = await Task.findById(taskId)
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name description');
    return task;
}
exports.getTasksByProjectId = async (projectId) => {
    const tasks = await Task.find({ projectId: projectId })
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name description');
    return tasks;
}
exports.updateTask = async (taskId, taskData) => {
    const updatedTask = await Task.findByIdAndUpdate(
        taskId, 
        taskData, 
        { 
            returnDocument: 'after',
            runValidators: true});  
    return updatedTask;
}
exports.deleteTask = async (taskId) => {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return deletedTask;
}


