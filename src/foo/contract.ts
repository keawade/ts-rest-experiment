import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const FooSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    body: z.string(),
});
export type Foo = z.infer<typeof FooSchema>;

const MyErrorSchema = z.object({
    message: z.string(),
});
export type MyError = z.infer<typeof MyErrorSchema>;

export const foosContract = c.router({
    createFoo: {
        method: 'POST',
        path: '/foo',
        responses: {
            201: FooSchema,
        },
        body: z.object({
            title: z.string(),
            body: z.string(),
        }),
        summary: 'Create foo',
    },
    getFoo: {
        method: 'GET',
        path: '/foo/:id',
        pathParams: z.object({
            id: z.string().uuid(),
        }),
        responses: {
            200: FooSchema.nullable(),
            404: MyErrorSchema,
        },
        summary: 'Get a foo by id',
    },
});
