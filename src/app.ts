import { default as express } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { Post, contract } from './contract';
import { randomUUID } from 'node:crypto';
import { generateOpenApi } from '@ts-rest/open-api';
import { default as swaggerUI } from 'swagger-ui-express';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();

const posts = new Map<string, Post>();

const openApiDocument = generateOpenApi(
    contract,
    {
        info: {
            title: 'Posts API',
            version: '1.0.0',
        },
    },
    {
        setOperationId: true,
    },
);

app.get('/docs/json', (_req, res) => {
    return res.json(openApiDocument);
});
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openApiDocument));

const router = s.router(contract, {
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
});

createExpressEndpoints(contract, router, app);

export { app };
