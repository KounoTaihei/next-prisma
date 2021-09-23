import { NextApiRequest, NextApiResponse } from "next";
import { NoteWithUserAndItems } from "../../../../types/note";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const text: string = req.query.searchText.toString();
            const notes: NoteWithUserAndItems[] =  await prisma.note.findMany({
                where: {
                    title: {
                        contains: text
                    }
                },
                include: {
                    user: true,
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