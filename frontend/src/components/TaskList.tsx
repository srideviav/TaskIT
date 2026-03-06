"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { updateTask, deleteTask, getTask } from "../services/tasks.service";

interface Task {
    _id: string;
    title: string;
    description: string;
    status?: string;
    assignee?: string;
    projectId?: string;
}

interface TaskDetailModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
}

export default function TaskList({
    open,
    task,
    onClose,
    onTaskUpdated,
}: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [taskDetails, setTaskDetails] = useState<Task>(task);

    React.useEffect(() => {
        if (open && task._id) {
            fetchTaskDetails();
        }
    }, [open, task._id]);

    const fetchTaskDetails = async () => {
        try {
            const details = await getTask(task._id);
            setTaskDetails(details);
            form.setFieldsValue({
                title: details.title,
                description: details.description,
                status: details.status,
                assignee: details.assignee,
            });
        } catch (error) {
            console.error("Failed to fetch task details:", error);
            message.error("Failed to fetch task details");
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue({
            title: taskDetails.title,
            description: taskDetails.description,
            status: taskDetails.status,
            assignee: taskDetails.assignee,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteTask(task._id);
            message.success("Task deleted successfully!");
            onClose();
            onTaskUpdated();
        } catch (error) {
            console.error("Failed to delete task:", error);
            message.error("Failed to delete task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const updateData = {
                title: values.title,
                description: values.description,
                status: values.status,
                assignee: values.assignee,
            };
            await updateTask(task._id, updateData);
            message.success("Task updated successfully!");
            setIsEditing(false);
            onTaskUpdated();
        } catch (error) {
            console.error("Failed to update task:", error);
            message.error("Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={isEditing ? "Edit Task" : "Task Details"}
            open={open}
            onCancel={onClose}
            footer={
                !isEditing && (
                    <Space>
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                        <Popconfirm
                            title="Delete Task"
                            description="Are you sure you want to delete this task?"
                            onConfirm={handleDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                loading={loading}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                )
            }
        >
            {isEditing ? (
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
                        <Select placeholder="Select status">
                            <Select.Option value="To Do">To Do</Select.Option>
                            <Select.Option value="In Progress">In Progress</Select.Option>
                            <Select.Option value="Done">Done</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Assignee"
                        name="assignee"
                    >
                        <Input placeholder="Assignee name or ID" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ flex: 1 }}
                            >
                                Save Changes
                            </Button>
                            <Button onClick={handleCancel} style={{ flex: 1 }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            ) : (
                <div>
                    <p style={{ marginBottom: "16px" }}>
                        <strong>Title:</strong> {taskDetails.title}
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        <strong>Description:</strong> {taskDetails.description}
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                                padding: "4px 12px",
                                backgroundColor: getStatusColor(taskDetails.status),
                                borderRadius: "4px",
                                color: "white",
                                fontSize: "12px",
                            }}
                        >
                            {taskDetails.status || "No Status"}
                        </span>
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        <strong>Assignee:</strong> {taskDetails.assignee || "Not assigned"}
                    </p>
                </div>
            )}
        </Modal>
    );
}

function getStatusColor(status?: string): string {
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
