"use client";

import React, { useContext, useState } from "react";
import { getAllTasks, createTask, getTask } from "../services/tasks.service";
import { AuthContext } from "../context/authContext";
import { Button, Modal, Form, Input, message, Space, Empty, Select, Pagination } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import TaskDetail from "./TaskDetail";
import { getAllUsers } from "../services/auth.service";
import ProjectsPage from "../app/projects/page";
import useSocket from "../hooks/useSocket";
import { getSocket } from "../lib/socket";

interface Project {
    _id: string;
    name: string;
    description: string;
    members?: string[];
}

interface ProjectDetailProps {
    project: Project;
    onBack: () => void;
}

interface IUser {
    _id: string;
    name: string;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [form] = Form.useForm();
    const auth = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [assigneeFilter, setAssigneeFilter] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const userId = auth?.user?._id?.toString();
    const token = auth?.user?.token?.toString();
    const { activeMembers } = useSocket({ projectId: project._id }, token || "");


    console.log("ACtive mebers:", activeMembers)

    const statusOptions = [
        { label: "To Do", value: "To Do" },
        { label: "In Progress", value: "In Progress" },
        { label: "Done", value: "Done" },
    ];

    const loadUsers = async () => {
        try {
            const userList: IUser[] = await getAllUsers();
            setUsers(userList);
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    const handleTaskCreated = (newTask: any) => {
        console.log("Received taskCreated event:", newTask);
        if (newTask.projectId === project._id || newTask.projectId?._id === project._id) {
            setTasks((prev) => [newTask, ...prev]);
            message.success("New task created by team member!");
        }
    };

 
    React.useEffect(() => {
        fetchTasks();
        loadUsers();
        try {
            const socket = getSocket();
            socket.on("taskCreatedFE", handleTaskCreated);
            return () => {
                socket.off("taskCreatedFE", handleTaskCreated);
            };
        } catch (err) {
            console.error("Socket not connected for task listeners:", err);
        }
    }, [project._id]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await getAllTasks(project._id);
            setTasks(tasksData);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            message.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleTaskClick = (task: any) => {
        setSelectedTask(task);
        setIsTaskDetailOpen(true);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const taskData = {
                title: values.title,
                description: values.description,
                projectId: project._id,
                status: values.status || "To Do",
                assignedTo: values.assignedTo || userId,
            };
            const createdTask = await createTask(taskData);
            message.success("Task created successfully!");
            setIsModalOpen(false);
            form.resetFields();

            const getChanges = await getTask(createdTask.data._id);

            // Emit socket event to notify other browsers
            try {
                const socket = getSocket();
                console.log("taskCreatedFE:", getChanges._id);
                socket.emit("taskCreatedFE", getChanges);
            } catch (err) {
                console.error("Failed to emit task creation:", err);
            }

            fetchTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
            message.error("Failed to create task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleTaskModalClose = () => {
        setIsTaskDetailOpen(false);
        setSelectedTask(null);
    };

    const handleTaskDetailsUpdated = () => {
        // Refetch tasks after modal closes
        fetchTasks();
        handleTaskModalClose();
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                <h1 className="text-2xl font-semibold mb-2">
                    {project.name}
                </h1>
                <p className="text-gray-600">
                    {project.description}</p>
                <p>
                    <strong>Members:</strong>{" "}
                    {project.members && project.members.length > 0
                        ? project.members.map((m: any) => m.name).join(", ")
                        : "No members"}
                </p>
            </div>

            <Space style={{ marginBottom: "20px" }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    style={{
                        backgroundColor: "#032b53",
                        color: "white",
                        border: "none"
                    }}
                >
                    Back to Projects
                </Button>

                <Button
                    icon={<PlusOutlined />}
                    onClick={handleCreateClick}
                    style={{
                        backgroundColor: "#032b53",
                        color: "white",
                        border: "none"
                    }}
                >
                    Create New Task
                </Button>
                <Input
                    placeholder="Search tasks by title..."
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ width: "200px" }}
                    allowClear
                />

                <Select
                    placeholder="Filter by status"
                    style={{ width: "150px" }}
                    value={statusFilter || "all"}
                    onChange={(value) => {
                        setStatusFilter(value === "all" ? undefined : value);
                        setCurrentPage(1);
                    }}
                    options={[
                        { label: "All Status", value: "all" },
                        { label: "To Do", value: "To Do" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "Done", value: "Done" },
                    ]}
                    allowClear
                />

                <Select
                    placeholder="Filter by assignee"
                    style={{ width: "180px" }}
                    value={assigneeFilter}
                    onChange={(value) => {
                        setAssigneeFilter(value);
                        setCurrentPage(1);
                    }}
                    options={[
                        { label: "All Assignees", value: undefined },
                        ...users.map((user) => ({
                            label: user.name,
                            value: user._id,
                        })),
                    ]}
                    allowClear
                />

            </Space>

            <Modal
                title="Create New Task"
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
                        label="Task Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter task title" }]}
                    >
                        <Input placeholder="Enter task title" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter task description" }]}
                    >
                        <Input.TextArea
                            placeholder="Enter task description"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select status" }]}
                    >
                        <Select
                            placeholder="Select status"
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Assignee"
                        name="assignedTo"
                    >
                        <Select
                            placeholder="Search and select assignee"
                            allowClear
                            showSearch
                            options={users.map((user) => ({
                                label: user.name,
                                value: user._id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Create Task
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <div>
                {tasks.length === 0 ? (
                    <Empty description="No tasks found. Create one to get started!" />
                ) : (() => {
                    // Filter tasks based on search and filter criteria
                    const filteredTasks = tasks.filter((task) => {
                        const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase());
                        const matchesStatus = !statusFilter || task.status === statusFilter;
                        const matchesAssignee = !assigneeFilter ||
                            (typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo) === assigneeFilter;
                        return matchesSearch && matchesStatus && matchesAssignee;
                    });

                    if (filteredTasks.length === 0) {
                        return <Empty description="No tasks match your filters." />;
                    }

                    // Calculate pagination
                    const totalTasks = filteredTasks.length;
                    const startIndex = (currentPage - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

                    return (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {paginatedTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task)}
                                        style={{
                                            padding: "12px 16px",
                                            border: "1px solid #f0f0f0",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            transition: "all 0.3s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1890ff")}
                                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f0f0f0")}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>
                                                {task.title}
                                            </p>
                                            <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>
                                                {task.description}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                padding: "4px 12px",
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "4px",
                                                color: "#333",
                                                fontSize: "12px",
                                                marginLeft: "12px",
                                                whiteSpace: "nowrap",
                                                border: "1px solid #d9d9d9",
                                            }}
                                        >
                                            <>Assignee: </> {typeof task.assignedTo === 'object' ? task.assignedTo.name : (task.assignedTo ? "Assigned" : "Unassigned")}
                                        </div>
                                        <div
                                            style={{
                                                padding: "4px 12px",
                                                backgroundColor: getStatusColor(task.status),
                                                borderRadius: "4px",
                                                color: "white",
                                                fontSize: "12px",
                                                marginLeft: "12px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {task.status || "No Status"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalTasks}
                                onChange={(page) => setCurrentPage(page)}
                                style={{ marginTop: "20px", textAlign: "center" }}
                            />
                        </>
                    );
                })()}
            </div>

            {selectedTask && (
                <TaskDetail
                    open={isTaskDetailOpen}
                    task={selectedTask}
                    onClose={handleTaskModalClose}
                    onTaskUpdated={handleTaskDetailsUpdated}
                />
            )}

            {project._id && (
                <ProjectsPage
                    projectId={project._id}
                />
            )}

        </div>
    );
}

function getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
        case "done":
        case "completed":
            return "#52c41a";
        case "in progress":
            return "#1890ff";
        case "to do":
        default:
            return "#d9d9d9";
    }
}
