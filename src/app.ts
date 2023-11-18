import { default as express } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { generateOpenApi } from '@ts-rest/open-api';
import { default as swaggerUI } from 'swagger-ui-express';
import { postsContract, postsRoutes } from './posts';
import { fooRoutes, foosContract } from './foo';
import { initContract } from '@ts-rest/core';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const c = initContract();
const s = initServer();

const openApiDocument = generateOpenApi(
    c.router({
        // Note: This structure does not affect route paths
        posts: postsContract,
        foos: foosContract,
    }),
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

createExpressEndpoints(
    postsContract,
    s.router(postsContract, postsRoutes),
    app,
);
createExpressEndpoints(foosContract, s.router(foosContract, fooRoutes), app);

export { app };
