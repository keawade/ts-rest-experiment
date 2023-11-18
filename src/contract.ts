import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const PostSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    body: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

const MyErrorSchema = z.object({
    message: z.string(),
});
export type MyError = z.infer<typeof MyErrorSchema>;

export const contract = c.router({
    createPost: {
        method: 'POST',
        path: '/post',
        responses: {
            201: PostSchema,
        },
        body: z.object({
            title: z.string(),
            body: z.string(),
        }),
        summary: 'Create post',
    },
    getPost: {
        method: 'GET',
        path: '/post/:id',
        responses: {
            200: PostSchema.nullable(),
            404: MyErrorSchema,
        },
        summary: 'Get a post by id',
    },
});
