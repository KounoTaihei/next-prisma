import { Prisma } from '.prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Prisma.BatchPayload | null>) {
    const method = req.method;
    switch (method) {
        case 'DELETE': {
            const id: string = req.query.noteId.toString();
            const items = await prisma.item.deleteMany({
                where: {
                    noteId: id
                }
            })
            res.status(200).json(items);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}