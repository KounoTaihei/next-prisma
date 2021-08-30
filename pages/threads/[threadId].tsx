import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Thread } from "@prisma/client";
import Link from "next/link";
import { Button } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";

const apiUrl = API_URL + "/threads";

const FindThread = ({ thread }: Props) => {
    const router = useRouter();

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