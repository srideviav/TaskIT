"use client";

import React, { useContext } from "react";
import { getAllProjects, createProject, updateProject, deleteProject } from "../services/projects.service";
import { getAllUsers } from "../services/auth.service";
import { AuthContext } from "../context/authContext";
import { Button, Modal, Form, Select, Input, message, Collapse, Space, Popconfirm, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import ProjectDetail from "./ProjectDetail";

export default function ProjectList() {
    const [projects, setProjects] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState<any>(null);
    const [users, setUsers] = React.useState<any[]>([]);
    const [form] = Form.useForm();
    const auth = useContext(AuthContext);
    const [searchValue, setSearchValue] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 5;

    const userId = auth?.user?._id?.toString();

    const fetchProjects = async () => {
        try {
            const projectsData = await getAllProjects(userId);
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const usersList = await getAllUsers();
            setUsers(usersList);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            message.error("Failed to fetch users");
        }
    };

    React.useEffect(() => {
        if (!userId) return;

        fetchProjects();
        fetchUsers();
    }, [userId]);


    const handleCreateClick = () => {
        setEditingProject(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (project: any) => {
        setEditingProject(project);
        // Extract member IDs if members are objects, otherwise use as-is
        const memberIds = project.members?.map((m: any) => (typeof m === 'object' ? m._id : m)) || [];
        form.setFieldsValue({
            name: project.name,
            description: project.description,
            members: memberIds,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (projectId: string) => {
        try {
            await deleteProject(projectId);
            message.success("Project deleted successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
            message.error("Failed to delete project. Please try again.");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {
        console.log("Form values:", values);
        setLoading(true);
        try {
            if (editingProject) {
                // Update existing project
                const projectData = {
                    name: values.name,
                    description: values.description,
                    members: values.members || editingProject.members,
                };
                await updateProject(editingProject._id, projectData);
                message.success("Project updated successfully!");
            } else {
                // Create new project
                if (!userId) return null;
                const projectData = {
                    name: values.name,
                    description: values.description,
                    owner: userId ,
                    members: values.members || [],
                };
                await createProject(projectData);
                message.success("Project created successfully!");
            }
            setIsModalOpen(false);
            setEditingProject(null);
            form.resetFields();
            fetchProjects();
        } catch (error) {
            console.error("Failed to save project:", error);
            message.error("Failed to save project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (auth?.loading) {
        return <p>Loading...</p>;
    }

    // If a project is selected, show the project detail view
    if (selectedProject) {
        return (
            <ProjectDetail
                project={selectedProject}
                onBack={() => {
                    setSelectedProject(null);
                    fetchProjects();
                }}
            />
        );
    }

    // Filter projects based on search value
    const filteredProjects = projects.filter((project: any) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate pagination
    const totalProjects = filteredProjects.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    const collapsedItems = paginatedProjects.map((project: any) => ({
        key: project._id,
        label: project.name,
        children: (
            <div>
                <p><strong>Description:</strong> {project.description || "No description"}</p>
                <p>
                    <strong>Members:</strong>{" "}
                    {project.members.length > 0
                        ? project.members.map((m: any) => m.name).join(", ")
                        : "No members"}
                </p>
                 
                <Space style={{ marginTop: "16px" }}>
                    <Button
                        type="primary"
                        icon={<FolderOpenOutlined />}
                        onClick={() => setSelectedProject(project)}
                    >
                        Open Project
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(project)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Project"
                        description="Are you sure you want to delete this project?"
                        onConfirm={() => handleDelete(project._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            </div>
        ),
    }));

    return (
        <div style={{ padding: "20px" }}>
            <h1 className="text-2xl font-semibold mb-4">Projects</h1>

            <Button type="primary" onClick={handleCreateClick} style={{ marginBottom: "20px" }}>
                Create Project
            </Button>

            <Input
                placeholder="Search projects by name..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(1);
                }}
                style={{ marginBottom: "20px" }}
                allowClear
            />

            <Modal
                title={editingProject ? "Edit Project" : "Create New Project"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Project Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter project name" }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter project description" }]}
                    >
                        <Input.TextArea placeholder="Enter project description" rows={4} />
                    </Form.Item>


                    <Form.Item
                        label="Members"
                        name="members"
                     >
                        <Select
                            mode="multiple"
                            placeholder="Search and select members"
                            showSearch
                            options={users.map((user) => ({
                                label: user.name,
                                value: user._id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {editingProject ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {projects.length === 0 ? (
                <p>No projects found</p>
            ) : filteredProjects.length === 0 ? (
                <p>No projects match your search criteria.</p>
            ) : (
                <>
                    <Collapse items={collapsedItems} />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalProjects}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ marginTop: "20px", textAlign: "center" }}
                    />
                </>
            )}
        </div>
    );
}