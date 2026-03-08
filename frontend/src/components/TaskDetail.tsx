"use client";

import React, { useContext, useState } from "react";
import { Modal, Button, Form, Input, Select, message, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { updateTask, deleteTask, getTask, addComment } from "../services/tasks.service";
import { getAllUsers } from "../services/auth.service";
import { AuthContext } from "../context/authContext";
import { getSocket } from "../lib/socket";

interface IUser {
    _id: string;
    name: string;
}

interface IComment {
    _id?: string;
    text: string;
    userId?: string | IUser;
    createdAt?: Date | string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status?: string;
    assignedTo?: string | IUser;
    projectId?: string;
    comments?: IComment[];
}

interface TaskDetailModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
    initialTasks: any;
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
    initialTasks
}: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [taskDetails, setTaskDetails] = useState<Task>(task);
    const [users, setUsers] = useState<IUser[]>([]);
    const [newComment, setNewComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const auth = useContext(AuthContext);

    React.useEffect(() => {
        if (open && task._id) {
            fetchTaskDetails();
            loadUsers();
        }
    }, [open, task]);

    // Helper function to extract projectId from task object
    const getProjectId = (projectId?: string | { _id: string }): string | undefined => {
        if (!projectId) return undefined;
        return typeof projectId === 'object' ? projectId._id : projectId;
    };

    const handleTaskUpdated = (updatedTask: any) => {
        console.log("Received taskUpdated event:", updatedTask);
        const taskProjectId = getProjectId(updatedTask.projectId);
        const currentProjectId = getProjectId(taskDetails.projectId);

        if (taskProjectId && currentProjectId && taskProjectId === currentProjectId) {
            // Update the task details if it's the current task
            if (updatedTask._id === taskDetails._id) {
                setTaskDetails(updatedTask);
                message.info("Task updated by team member!");
            }
        }
    };

    const handleTaskDeleted = (deletedTask: any) => {
        console.log("Received taskDeleted event:", deletedTask);
        const taskProjectId = getProjectId(deletedTask.projectId);
        const currentProjectId = getProjectId(taskDetails.projectId);

        if (taskProjectId && currentProjectId && taskProjectId === currentProjectId) {
            // Close the modal if the current task was deleted
            if (deletedTask._id === taskDetails._id) {
                message.info("This task was deleted by team member.");
                onClose();
            }
        }
    };

    React.useEffect(() => {
        // Only register listeners if we have a valid projectId
        if (!taskDetails?.projectId) return;

        try {
            const socket = getSocket();

            socket.on("taskUpdatedFE", handleTaskUpdated);
            socket.on("taskDeletedFE", handleTaskDeleted);

            return () => {
                socket.off("taskUpdatedFE", handleTaskUpdated);
                socket.off("taskDeletedFE", handleTaskDeleted);
            };
        } catch (err) {
            console.error("Socket not connected for task listeners:", err);
        }
    }, [taskDetails.projectId]);

    const userId = auth?.user?._id?.toString();

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
            const taskToDelete = { ...taskDetails };
            await deleteTask(task._id);
            message.success("Task deleted successfully!");

            // Emit socket event to notify other browsers
            try {
                const socket = getSocket();
                console.log("Emitting taskDeletedFE for task:", taskToDelete._id);
                socket.emit("taskDeletedFE", taskToDelete);
            } catch (err) {
                console.error("Failed to emit task deletion:", err);
            }

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
        setLoading(true);
        try {
            const assignedToId = values.assignedTo
                ? (typeof values.assignedTo === 'object' ? values.assignedTo._id : values.assignedTo)
                : undefined;
            const updateData = {
                title: values.title,
                description: values.description,
                status: values.status,
                assignedTo: assignedToId,
            };
            const updatedTask = await updateTask(task._id, updateData);
            message.success("Task updated successfully!");
            setIsEditing(false);
            console.log("up:0", updatedTask.data._id)
            const getChanges = await getTask(updatedTask.data._id);
            setTaskDetails(getChanges);

            // Emit socket event to notify other browsers
            try {
                const socket = getSocket();
                console.log("taskUpdatedFE:", getChanges._id);
                socket.emit("taskUpdatedFE", getChanges);
            } catch (err) {
                console.error("Failed to emit task update:", err);
            }

            onTaskUpdated();
        } catch (error) {
            console.error("Failed to update task:", error);
            message.error("Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            message.warning("Please enter a comment");
            return;
        }

        try {
            setAddingComment(true);
            if (!userId) return null;
            await addComment(task._id, newComment, userId);

            const updatedTask = await getTask(task._id);
            setTaskDetails(updatedTask);

            setNewComment("");
            message.success("Comment added successfully!");
        } catch (error) {
            console.error("Failed to add comment:", error);
            message.error("Failed to add comment. Please try again.");
        } finally {
            setAddingComment(false);
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
                    <p style={{ marginBottom: "24px" }}>
                        <strong>Assignee:</strong>{" "}
                        {taskDetails.assignedTo
                            ? typeof taskDetails.assignedTo === "object"
                                ? taskDetails.assignedTo.name
                                : taskDetails.assignedTo
                            : "Not Assigned"}
                    </p>

                    {/* Comments Section */}
                    <div style={{ marginTop: "24px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                        <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}>Comments</h3>

                        {/* Comments List */}
                        <div
                            style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                marginBottom: "16px",
                                padding: "8px",
                                backgroundColor: "#fafafa",
                                borderRadius: "4px",
                                minHeight: "100px",
                            }}
                        >
                            {taskDetails.comments && taskDetails.comments.length > 0 ? (
                                <div>
                                    {taskDetails.comments.map((comment: any, index: number) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "12px",
                                                marginBottom: "8px",
                                                backgroundColor: "white",
                                                borderLeft: "3px solid #1890ff",
                                                borderRadius: "2px",
                                                fontSize: "14px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            <div style={{ marginBottom: "6px" }}>
                                                <strong style={{ color: "#0066cc" }}>
                                                    {typeof comment === 'object' && comment.userId
                                                        ? (typeof comment.userId === 'object' ? comment.userId.name : "Unknown User")
                                                        : "Anonymous"}
                                                </strong>
                                                {typeof comment === 'object' && comment.createdAt && (
                                                    <span style={{ color: "#999", fontSize: "12px", marginLeft: "8px" }}>
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                {typeof comment === 'object' ? comment.text : comment}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: "#999", textAlign: "center", padding: "32px 0" }}>
                                    No comments yet. Add one to get started!
                                </p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <Space.Compact style={{ width: "100%", display: "flex", gap: "8px" }}>
                            <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onPressEnter={handleAddComment}
                                disabled={addingComment}
                                style={{ flex: 1 }}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleAddComment}
                                loading={addingComment}
                            >
                                Send
                            </Button>
                        </Space.Compact>
                    </div>
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
