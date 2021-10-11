import { Item, Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { ItemWithHearts } from '../../../../types/item';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Item | Item[]>) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const noteId = req.query.noteId.toString();
            const items: ItemWithHearts[] = await prisma.item.findMany({
                where: {
                    noteId
                },
                include: {
                    hearts: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));

            res.status(200).json(items);
            break;
        }
        case 'POST': {
            const noteId = req.query.noteId.toString();
            const body: Prisma.ItemCreateInput = req.body;
            const item: Item = await prisma.item.create({
                data: {
                    title: body.title,
                    body: body.body,
                    noteId: noteId
                }
            });
            res.status(200).json(item);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}