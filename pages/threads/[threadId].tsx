import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Thread } from "@prisma/client";
import Link from "next/link";
import { Button } from "@material-ui/core";

const apiUrl = API_URL + "/threads";

const FindThread = ({ thread }: Props) => {
    return (
        <>
            <p>create: {thread.createdAt}</p>
            <p>title: {thread.title}</p>
            <div>
                <Link href="#">
                    <a className="p-2">
                        <Button variant="outlined">Delete</Button>
                    </a>
                </Link>
                <Link href="#">
                    <a className="p-2">
                        <Button variant="outlined" color="primary">Update</Button>
                    </a>
                </Link>
            </div>
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