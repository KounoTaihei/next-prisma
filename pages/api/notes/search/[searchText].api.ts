import { NextApiRequest, NextApiResponse } from "next";
import { NoteWithUserAndItems } from "../../../../types/note";

export default async function handler (req: NextApiRequest, res: NextApiResponse<NoteWithUserAndItems[]>) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const text = req.query.searchText.toString();
            let notes: NoteWithUserAndItems[]

            if(text) {
                notes = await prisma.note.findMany({
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
            } else {
                notes = await prisma.note.findMany({
                    include: {
                        user: true,
                        items: true
                    }
                })
                .then(res => JSON.parse(JSON.stringify(res)));
            }

            res.status(200).json(notes);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}