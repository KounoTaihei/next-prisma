import { GetStaticProps } from "next";
import { Item, Note, User } from "@prisma/client";
import Link from "next/link";
import prisma from "../../lib/prisma";
import { Card } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";

const Notes = ({ notes }: Props) => {
    const router = useRouter();

    return (
        <>
            <Link href="/notes/create"><a>add note</a></Link>
            <ul>
                {notes.map(note =>
                    <li key={note.id}>
                        <Card variant="outlined" className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => router.push(`/items/note/${note.id}`)}>
                            <p>タイトル: {note.title}[{note.items.length}]</p>
                            <p>ユーザー: {note.user.name}</p>
                        </Card>
                    </li>    
                )}
            </ul>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.note.findMany({
        include: {
            user: true,
            items: true
        }
    });
    const notes: NoteWithUserAndItems[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            notes
        }
    }
}

interface NoteWithUserAndItems extends Note {
    user: User
    items: Item[]
}

interface Props {
    notes: NoteWithUserAndItems[]
}

export default Notes;