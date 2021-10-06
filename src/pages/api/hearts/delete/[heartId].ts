import { Heart } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Heart>) {
    const session = await getSession({req});

    if(!session) {
        return;
    }
    
    const method = req.method;

    switch (method) {
        case 'GET': {
            const heartId = req.query.heartId.toString();

            const heart: Heart = await prisma.heart.delete({
                where: {
                    id: heartId
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));

            res.status(200).json(heart);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}