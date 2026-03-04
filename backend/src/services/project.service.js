const Project = require('../models/project.model');

exports.createNewProject = async (projectData) => {
    const newProject = new Project(projectData);
    return await newProject.save();
}
exports.ifProjectExists = async (projectName) => {
    const project = await Project.findOne({ name: projectName });
    return !!project;
}
exports.getProjectById = async (projectId) => {
    const project = await Project.findOne({_id:projectId})
    .populate('owner', 'name email')
    .populate('members', 'name email');
    return project;
}
exports.getAllProjectsByUserId = async (userId) => {
    const projects = await Project.find({ owner: userId })
        .populate('owner', 'name email')
        .populate('members', 'name email');
    return projects;
}
exports.updateProject = async (projectId, projectData) => {
    const updatedProject = await Project.findByIdAndUpdate(
        projectId, 
        projectData, 
        { returnDocument: 'after', runValidators: true });
    return updatedProject;
}
exports.deleteProject = async (projectId) => {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    return deletedProject;
}