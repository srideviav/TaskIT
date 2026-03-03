const {z} = require('zod');

exports.createProjectSchema = z.object({
    name: z
    .string({
        required_error: "Project name is required",
        invalid_type_error: "Project name must be a string"
    })
    .min(1, { message: "Project name is required" })
    .trim(),

    description: z
    .string({
        required_error: "Project description is required",
        invalid_type_error: "Project description must be a string"
    })
    .min(1, { message: "Project description is required" })
    .trim(),

    owner: z.string({
        required_error: "Project owner is required",
        invalid_type_error: "Project owner must be a string"
    })
    .min(1, { message: "Project owner is required" })
    .trim(),
});

exports.updateProjectSchema = z.object({
    projectId: z
    .string({
        required_error: "Project ID is required",
    })
    .trim(),
})