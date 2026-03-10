const { z } = require('zod');

 
exports.registerSchema = z.object({
  name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string"
    })
    .min(1, { message: "Name is required" })
    .trim(),

  email: z.email({
      message: "Email is required and must be a valid email address"
    })
    .trim(),

  password: z.string({
      required_error: "Password is required"
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .trim(),
});
 

exports.loginSchema = z.object({
    email: z
        .email({ message: "Email is required and must be a valid email address" })
        .trim(),
    password: z.string({
      required_error: "Password is required"
    })
    .trim(),
});
