import { Note } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Prisma } from '.prisma/client';
import { NoteWithUser } from '../../../types/note';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note | null>) {
    const method = req.method;
    switch (method) {
        case 'PUT': {
            const id: string = req.query.noteId.toString();
            const data: Prisma.NoteUpdateInput = req.body;
            const note: Note = await prisma.note.update({
                where: {
                    id
                },
                data: {
                    title: data.title
                }
            });
            res.status(200).json(note);
            break;
        }
        case 'DELETE': {
            const id: string = req.query.noteId.toString();
            const note: Note = await prisma.note.delete({
                where: { id }
            });
            res.status(200).json(note);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}