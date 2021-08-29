import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Thread } from "@prisma/client";

const apiUrl = API_URL + "/threads";

const FindThread = ({ thread }: Props) => {
    return (
        <>
            <p>create: {thread.createdAt}</p>
            <p>title: {thread.title}</p>
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