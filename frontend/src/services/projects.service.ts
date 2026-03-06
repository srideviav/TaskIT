import API from "../lib/axios";

interface Project {
    name: string,
    description: string,
    owner: string,
    members: string[] | undefined 
}

interface updateProject {
    name: string,
    description: string,
    members: string[] | undefined
}
export const createProject = async (project: Project) => {
    try {
        const response = await API.post('/taskIt/projects/create', project);
        console.log("Project creation response:", response);
        return response.data;
    } catch (error) {
        console.error("Project creation failed in projects service:", error);
        throw error;
    }
}

export const getAProject = async () => {
    try {
        const response = await API.get('/taskIt/projects/get/:projectId');
        console.log("Get a project response:", response);
        return response.data;
    } catch (error) {
        console.error("Get a project failed in projects service:", error);
        throw error;
    }
}

export const getAllProjects = async (userId: string | undefined) => {
    try {
        // console.log("Fetching projects for userId:", userId);
        const response = await API.get(`/taskIt/projects/getAll/${userId}`);
        console.log("Get all projects response:", response);
        return response.data.data;
    } catch (error) {
        console.error("Get all projects failed in projects service:", error);
        throw error;
    }
}

export const updateProject = async (projectId: String, project: updateProject) => {
    try {
        const response = await API.put(`/taskIt/projects/update/${projectId}`, project);
        console.log("Project update response:", response);
        return response.data;
    } catch (error) {
        console.error("Project update failed in projects service:", error);
        throw error;
    }
}

export const deleteProject = async (projectId: String) => {
    try {
        const response = await API.delete(`/taskIt/projects/delete/${projectId}`);
        console.log("Project deletion response:", response);
        return response.data;
    } catch (error) {
        console.error("Project deletion failed in projects service:", error);
        throw error;
    }
}