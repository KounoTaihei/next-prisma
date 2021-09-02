import { Note } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note | null>) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            const id: string = req.query.noteId.toString();
            const note = await prisma.note.findUnique({ where: { id } });
            res.json(note);
            break;
        }
        case 'DELETE': {
            const id: string = req.query.noteId.toString();
            const note: Note = await prisma.note.delete({
                where: { id }
            });
            res.json(note);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}