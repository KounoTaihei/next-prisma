import { Item } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Item | Item[]>) {
    const method = req.method;

    switch (method) {
        case 'POST': {
            const itemId: string = req.body.itemId;
            const userId: string = req.body.userId;
            
            if(!itemId || !userId) {
                return;
            }

            const data = await prisma.heart.create({
                data: {
                    itemId,
                    userId
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));

            res.status(200).json(data);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}