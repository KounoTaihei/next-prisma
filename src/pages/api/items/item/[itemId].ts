import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch(method) {
        case 'DELETE': {
            const itemId = req.query.itemId.toString();
            const hearts = await prisma.heart.deleteMany({
                where: {
                    itemId: itemId
                }
            });
            const item = await prisma.item.delete({
                where: { id: itemId }
            });
            const result = Object.assign(hearts, item);
            res.status(200).json(result);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}