const {z} = require('zod');

exports.createTaskSchema = z.object({
    title:z.string({
        required_error: "Task title is required",
    })
    .min(1, { message: "Task title is required" })
    .trim(),

    description: z.string({
        required_error: "Task description is required",
    })
    .min(10, { message: "Task description must be at least 10 characters long" })
    .trim(),

    projectId: z.string({
        required_error: "Project ID is required",
    })
    .min(1, { message: "Project ID is required" })
    .trim(),

})

exports.updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
    assignedTo: z.string().optional(),
})
