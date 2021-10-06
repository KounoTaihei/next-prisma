import { Note } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Prisma } from '.prisma/client';
import { NoteWithUser } from '../../../../types/note';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note | NoteWithUser | null>) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            const noteId: string = req.query.noteId.toString();
            const note: NoteWithUser | null = await prisma.note.findUnique({
                where: {
                    id: noteId
                },
                include: {
                    user: true
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));
            res.status(200).json(note);
            break;
        }
        case 'PUT': {
            const noteId: string = req.query.noteId.toString();
            const data: Prisma.NoteUpdateInput = req.body;
            const note: Note = await prisma.note.update({
                where: {
                    id: noteId
                },
                data: {
                    title: data.title
                }
            });
            res.status(200).json(note);
            break;
        }
        case 'DELETE': {
            const noteId: string = req.query.noteId.toString();
            const note: Note = await prisma.note.delete({
                where: { 
                    id: noteId
                }
            });
            res.status(200).json(note);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}