import { GetStaticProps } from "next";
import { Item, Note } from "@prisma/client";
import Link from "next/link";
import prisma from "../../lib/prisma";

const Notes = ({ notes }: Props) => {
    return (
        <>
            <Link href="/notes/create"><a>add note</a></Link>
            <ul>
                {notes.map(note =>
                    <li key={note.id}>
                        <p>title: <Link href={`/notes/${note.id}`}><a>{note.title}</a></Link></p>
                        <p>posts: <Link href={`/items/note/${note.id}`}><a>{note.items.length}</a></Link></p>
                    </li>    
                )}
            </ul>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.note.findMany({
        include: {
            items: true
        }
    });
    const notes: NoteWithItems[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            notes
        }
    }
}

interface NoteWithItems extends Note {
    items: Item[]
}

interface Props {
    notes: NoteWithItems[]
}

export default Notes;