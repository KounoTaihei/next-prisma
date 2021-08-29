import { GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Thread } from "@prisma/client";
import Link from "next/link";

const apiUrl = API_URL + "/threads";

const Threads = ({ threads }: Props) => {
    return (
        <>
            <ul>
                {threads.map(thread =>
                    <li key={thread.id}>
                        <p>title: <Link href={`/threads/${thread.id}`}><a>{thread.title}</a></Link></p>
                    </li>    
                )}
            </ul>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get(apiUrl);
    const threads = res.data;

    return {
        props: {
            threads
        }
    }
}

interface Props {
    threads: Thread[]
}

export default Threads;