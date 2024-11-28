import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Email is invalid"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password is too short")
        .max(32, "Password is too long"),
});

export const signUpSchema = loginSchema.extend({
    firstName: z
        .string({ required_error: "First name is required" })
        .min(2, "First name is too short"),
    lastName: z
        .string({ required_error: "Last name is required" })
        .min(2, "Last name is too short"),
});

export const assistantSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be longer than 2 characters")
        .max(20, "Name must be shorter than 20 characters"),
    instructions: z
        .string({ required_error: "Instructions are required" })
        .min(10, "Include more instructions"),
});

export const createFileSchema = z.object({
    fileName: z.string({ required_error: "File name is required" }),
    content: z.string({ required_error: "Content is required" }),
});
