import { Item } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Item[]>) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const items: Item[] = await prisma.item.findMany();
            res.status(200).json(items);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}