const ProjectService = require('../services/project.service');

exports.createProject = async (req, res, next) => {
    const projectData = {
        ...req.body,
        owner: req.user.id
    };
    try {
        const projectExists = await ProjectService.ifProjectExists(projectData.name);
        if (projectExists) {
            return res.status(400).json({
                message: 'Project with this name already exists'
            });
        } else {
            const newProject = await ProjectService.createNewProject({ ...projectData });
            res.status(201).json({
                message: 'Project created successfully',
                data: newProject
            });
        }
    } catch (error) {
        next(error);
    }
}

exports.getProjectById = async (req, res, next) => {
    try {
        const project = await ProjectService.getProjectById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ data: project });
    } catch (error) {
        next(error);
    }
}

exports.getAllProjectsByUserId = async (req, res, next) => {
    try {
        const projects = await ProjectService.getAllProjectsByUserId(req.params.userId);
        res.status(200).json({ data: projects });
    } catch (error) {
        next(error);
    }
}

exports.updateProject = async (req, res, next) => {
  try {
    const projectExists = await ProjectService.getProjectById(req.params.projectId);

    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await ProjectService.updateProject(
      req.params.projectId,
      req.body    
    );

    res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const deletedProject = await ProjectService.deleteProject(req.params.projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({
            message: 'Project deleted successfully',
            data: deletedProject
        });
    } catch (error) {
        next(error);
    }
}