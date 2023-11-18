import { RecursiveRouterObj } from '@ts-rest/express/src/lib/types';
import { foosContract, Foo } from './contract';
import { randomUUID } from 'node:crypto';

const foos = new Map<string, Foo>();

export const foosRoutes: RecursiveRouterObj<typeof foosContract> = {
    getFoo: async ({ params: { id } }) => {
        const foo = foos.get(id);

        if (!foo) {
            return {
                status: 404,
                body: { message: 'Foo not found.' },
            };
        }

        return { status: 200, body: foo };
    },
    createFoo: async ({ body }) => {
        const foo = {
            ...body,
            id: randomUUID(),
        };

        foos.set(foo.id, foo);
        console.log(`Created foo '${foo.id}'.`);

        return { status: 200, body: foo };
    },
};
