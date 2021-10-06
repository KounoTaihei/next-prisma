import { Item } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Item | Item[]>) {
    const method = req.method;

    switch (method) {
        case 'POST': {
            const itemId: string = req.body.itemId;
            const userId: string = req.body.userId;
            
            if(!itemId || !userId) {
                return;
            }

            const data = await prisma.heart.delete({
                where: {
                    userId_itemId: {
                        userId, itemId
                    }
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