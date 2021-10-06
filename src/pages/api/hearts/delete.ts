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

            const target = await prisma.heart.findUnique({
                where: {
                    
                }
            })

            // res.status(200).json(data);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}