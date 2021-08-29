import { Thread } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Thread[]>) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            const threads = await prisma.thread.findMany();
            res.status(200).json(threads);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}