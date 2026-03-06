"use client";

import React, { useContext, useState } from "react";
import { getAllTasks, createTask } from "../services/tasks.service";
import { AuthContext } from "../context/authContext";
import { Button, Modal, Form, Input, message, List, Card, Space, Empty } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import TaskList from "./TaskList";

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

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [form] = Form.useForm();
    const auth = useContext(AuthContext);

    const userId = auth?.user?.id?.toString();

    React.useEffect(() => {
        fetchTasks();
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
                assignee: values.assignee || userId,
            };
            await createTask(taskData);
            message.success("Task created successfully!");
            setIsModalOpen(false);
            form.resetFields();
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

    const handleTaskUpdated = () => {
        fetchTasks();
        handleTaskModalClose();
    };

    return (
        <div style={{ padding: "20px" }}>
            <Space style={{ marginBottom: "20px", width: "100%" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                >
                    Back to Projects
                </Button>
            </Space>

            <div style={{ marginBottom: "20px" }}>
                <h1 className="text-2xl font-semibold mb-2">{project.name}</h1>
                <p className="text-gray-600">{project.description}</p>
                {project.members && project.members.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>Members:</strong> {project.members.join(", ")}
                    </p>
                )}
            </div>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateClick}
                style={{ marginBottom: "20px" }}
            >
                Create New Task
            </Button>

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
                    >
                        <Input placeholder="e.g., To Do, In Progress, Done" />
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
                <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                {tasks.length === 0 ? (
                    <Empty description="No tasks found. Create one to get started!" />
                ) : (
                    <List
                        dataSource={tasks}
                        renderItem={(task) => (
                            <List.Item
                                key={task._id}
                                onClick={() => handleTaskClick(task)}
                                style={{ cursor: "pointer" }}
                            >
                                <List.Item.Meta
                                    title={task.title}
                                    description={task.description}
                                />
                                <div
                                    style={{
                                        padding: "4px 12px",
                                        backgroundColor: getStatusColor(task.status),
                                        borderRadius: "4px",
                                        color: "white",
                                        fontSize: "12px",
                                    }}
                                >
                                    {task.status || "No Status"}
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </div>

            {selectedTask && (
                <TaskList
                    open={isTaskDetailOpen}
                    task={selectedTask}
                    onClose={handleTaskModalClose}
                    onTaskUpdated={handleTaskUpdated}
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
