import { RecursiveRouterObj } from '@ts-rest/express/src/lib/types';
import { postsContract, Post } from './contract';
import { randomUUID } from 'node:crypto';

const posts = new Map<string, Post>();

export const postsRoutes: RecursiveRouterObj<typeof postsContract> = {
    getPost: async ({ params: { id } }) => {
        const post = posts.get(id);

        if (!post) {
            return {
                status: 404,
                body: { message: 'Post not found.' },
            };
        }

        return { status: 200, body: post };
    },
    createPost: async ({ body }) => {
        const post = {
            ...body,
            id: randomUUID(),
        };

        posts.set(post.id, post);
        console.log(`Created post '${post.id}'.`);

        return { status: 200, body: post };
    },
};
