import { Prisma, Thread } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Thread[] | Thread>) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            const threads = await prisma.thread.findMany({
                include: {
                    posts: true
                }
            });
            res.status(200).json(threads);
            break;
        }
        case 'POST': {
            const body: Prisma.ThreadCreateInput = req.body;
            const thread: Thread = await prisma.thread.create({
                data: {
                    title: body.title,
                }
            });
            res.status(200).json(thread);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}