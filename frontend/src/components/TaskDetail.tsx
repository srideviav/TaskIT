"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { updateTask, deleteTask, getTask } from "../services/tasks.service";
import { getAllUsers } from "../services/auth.service";

interface IUser {
    _id: string;
    name: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status?: string;
    assignedTo?: string | IUser;
    projectId?: string;
    comments?: string[];
}

interface TaskDetailModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
}

const getAssignedUserId = (assignedTo?: string | IUser) => {
  if (!assignedTo) return undefined;
  return typeof assignedTo === "object" ? assignedTo._id : assignedTo;
};

export default function TaskDetail({
    open,
    task,
    onClose,
    onTaskUpdated,
}: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [taskDetails, setTaskDetails] = useState<Task>(task);
    const [users, setUsers] = useState<IUser[]>([]);

    React.useEffect(() => {
        if (open && task._id) {
            fetchTaskDetails();
            loadUsers();
        }
    }, [open, task]);

    const fetchTaskDetails = async () => {
        try {
            const details = await getTask(task._id);
            setTaskDetails(details);
            const assignedToValue = getAssignedUserId(details.assignedTo);
            form.setFieldsValue({
                title: details.title,
                description: details.description,
                status: details.status,
                assignedTo: assignedToValue,
            });
        } catch (error) {
            console.error("Failed to fetch task details:", error);
            message.error("Failed to fetch task details");
        }
    };

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

    const handleEdit = () => {
        setIsEditing(true);
        const assignedToValue = getAssignedUserId(taskDetails.assignedTo);
        form.setFieldsValue({
            title: taskDetails.title,
            description: taskDetails.description,
            status: taskDetails.status,
            assignedTo: assignedToValue,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.setFieldsValue({
            title: taskDetails.title,
            description: taskDetails.description,
            status: taskDetails.status,
            assignedTo: getAssignedUserId(taskDetails.assignedTo),
        });
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
            // Extract assignedTo ID if it's an object, otherwise use as-is
            const assignedToId = values.assignedTo
                ? (typeof values.assignedTo === 'object' ? values.assignedTo._id : values.assignedTo)
                : undefined;
            const updateData = {
                title: values.title,
                description: values.description,
                status: values.status,
                assignedTo: assignedToId,
                comments: values.comments || [],
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
            onCancel={() => {
                setIsEditing(false);
                onClose();
            }}
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
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (option?.label as string)
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={users.map((user) => ({
                                label: user.name,
                                value: user._id,
                            }))}
                        />
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
                            {taskDetails.status}
                        </span>
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        <strong>Assignee:</strong>{" "}
                        {taskDetails.assignedTo
                            ? typeof taskDetails.assignedTo === "object"
                                ? taskDetails.assignedTo.name
                                : taskDetails.assignedTo
                            : "Not Assigned"}
                    </p>
                </div>
            )}
        </Modal>
    );
}

function getStatusColor(status?: string): string {
    const map: Record<string, string> = {
        done: "#52c41a",
        completed: "#52c41a",
        "in progress": "#1890ff",
        "to do": "#d9d9d9",
    };

    return map[status?.toLowerCase() || ""] || "#d9d9d9";
}
