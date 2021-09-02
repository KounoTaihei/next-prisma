import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { Note } from "@prisma/client";
import Link from "next/link";
import { Button, Modal } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import prisma from "../../lib/prisma";

const apiUrl = process.env.API_URL + "/notes";

const FindNote = ({ note }: Props) => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalBody = (
        <div className="bg-white fixed inset-2/4 transform -translate-y-1/2 -translate-x-1/2 w-max h-48 p-4 rounded-md">
            <div className="flex-auto items-center">
                <span className="p-4 text-lg">Update Thread</span>
                <FontAwesomeIcon icon={faTimesCircle} onClick={handleClose} className="cursor-pointer text-2xl" />
            </div>
            <div>
                modal body
            </div>
        </div>
    )

    async function deleteNote() {
        if(confirm(`${note.title}を削除しますか？`)) {
            await axios.delete(`${apiUrl}/${note.id}`).then(() => router.push('/notes'));
        }
    }

    return (
        <>
            <p>create: {note.createdAt}</p>
            <p>title: {note.title}</p>
            <div>
                <Link href="#">
                    <a className="p-2">
                        <Button variant="outlined" onClick={deleteNote}>Delete</Button>
                    </a>
                </Link>
                <span className="p-2">
                    <Button variant="outlined" color="primary" onClick={handleOpen}>Update</Button>
                </span>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                {modalBody}
            </Modal>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes: Note[] = await prisma.note.findMany();
    const paths = notes.map(note => `/notes/${note.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.noteId?.toString();
    const res: Note | null = await prisma.note.findUnique({
        where: {
            id
        }
    });
    const note: Note = await JSON.parse(JSON.stringify(res));
    
    return {
        props: {
            note
        }
    }
}

interface Props {
    note: Note
}

export default FindNote;