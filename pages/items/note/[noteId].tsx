import { Item, Note } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { formatDate } from "../../../functions/date.format";
import prisma from "../../../lib/prisma";

const apiUrl = process.env.API_URL;

const FindItemsByNoteId = ({ note, items }: Props) => {
    return (
        <>
            <p>ノート: {note.title}</p>
            <Link href={`/items/create/${note.id}`}><a>このノートにアイテムを追加する</a></Link>
            {items.length > 0 ? 
                <ul>
                    {items.map(item => 
                        <li key={item.id}>
                            <p>create: {formatDate(note.createdAt)}</p>
                            <p>body: {item.body}</p>
                        </li>
                    )}
                </ul>
                :
                <p>アイテムはありません</p>
            }
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes: Note[] = await prisma.note.findMany();
    const paths = notes.map(note => `/items/note/${note.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const noteId = params?.noteId?.toString();

    const note: Note | null = await prisma.note.findUnique({
        where: {
            id: noteId
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    const items: Item[] = await prisma.item.findMany({
        where: {
            noteId
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));
    
    return {
        props: {
            note,
            items
        }
    }
}

interface Props {
    note: Note
    items: Item[]
}

export default FindItemsByNoteId;