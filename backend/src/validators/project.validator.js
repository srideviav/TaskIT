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
    })
    .min(1, { message: "Project owner is required" })
    .trim(),
});

exports.updateProjectSchema = z.object({
    name:z.string().optional() ,
    description: z.string().optional() ,
    members: z.array(z.string()).optional(),
})