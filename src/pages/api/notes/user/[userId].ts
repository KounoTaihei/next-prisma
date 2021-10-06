import { NextApiRequest, NextApiResponse } from "next";
import { NoteWithItems } from "../../../../../types/note";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const userId: string = req.query.userId.toString();
            const notes: NoteWithItems[] = await prisma.note.findMany({
                where: {
                    userId
                },
                include: {
                    items: true
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));
            res.status(200).json(notes);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}