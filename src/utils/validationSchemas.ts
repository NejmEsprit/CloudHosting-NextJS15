import { text } from "stream/consumers";
import { z } from "zod";

export const createarticleSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title sould be of type string ",
    })
    .min(2, { message: "title must be more than 2 characters" })
    .max(200, { message: "title sould be less than 200 characters" }),
  description: z.string().min(10),
});

export const createUserSchema = z.object({
  username: z.string().min(2).max(100), //.optional(),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});
export const updateteUserSchema = z.object({
  username: z.string().min(2).max(100).optional(), //.optional(),
  email: z.string().min(3).max(200).email().optional(),
  password: z.string().min(6).optional(),
});
export const loginUserSchema = z.object({
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

//Create Comment Schema
export const createCommetSchema =z.object({
  text :z.string().min(2).max(400),
  articleId: z.number()
}) 
