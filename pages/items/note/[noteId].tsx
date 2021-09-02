import { Item, Note } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../../lib/prisma";

const apiUrl = process.env.API_URL;

const FindItemsByNoteId = ({ items }: Props) => {
    return (
        <>
            <ul>
                {items.map(item => 
                    <li key={item.id}>
                        <p>create: {item.createdAt}</p>
                        <p>title: {item.title}</p>
                        <p>body: {item.body}</p>
                    </li>
                )}
            </ul>
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
    const res = await prisma.item.findMany({
        where: {
            noteId
        }
    });
    const items: Item[] = await JSON.parse(JSON.stringify(res));
    
    return {
        props: { items }
    }
}

interface Props {
    items: Item[]
}

export default FindItemsByNoteId;