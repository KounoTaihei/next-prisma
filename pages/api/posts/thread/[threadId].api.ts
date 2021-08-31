import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Post[]>) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const threadId = req.query.threadId.toString();
            const posts: Post[] = await prisma.post.findMany({
                where: {
                    threadId: threadId
                }
            });
            res.status(200).json(posts);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}