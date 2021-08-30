import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Thread } from "@prisma/client";
import Link from "next/link";
import { Button, Modal } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiUrl = API_URL + "/threads";

const FindThread = ({ thread }: Props) => {
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

    async function deleteThread() {
        if(confirm(`${thread.title}を削除しますか？`)) {
            await axios.delete(`${apiUrl}/${thread.id}`).then(() => router.push('/threads'));
        }
    }

    return (
        <>
            <p>create: {thread.createdAt}</p>
            <p>title: {thread.title}</p>
            <div>
                <Link href="#">
                    <a className="p-2">
                        <Button variant="outlined" onClick={deleteThread}>Delete</Button>
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
    const threads: Thread[] = await axios.get(apiUrl).then(v => v.data);
    const paths = threads.map(thread => `/threads/${thread.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.threadId?.toString();
    const thread: Thread = await axios.get(`${apiUrl}/${id}`).then(v => v.data);
    
    return {
        props: {
            thread
        }
    }
}

interface Props {
    thread: Thread
}

export default FindThread;