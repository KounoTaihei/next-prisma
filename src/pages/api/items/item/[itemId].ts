import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch(method) {
        case 'DELETE': {
            const itemId = req.query.itemId.toString();
            const item = await prisma.item.delete({
                where: { id: itemId }
            });
            res.status(200).json(item);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}