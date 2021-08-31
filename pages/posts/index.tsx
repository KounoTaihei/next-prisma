import { Post } from "@prisma/client";
import { GetStaticProps } from "next";
import prisma from "../../lib/prisma";

const Posts = ({ posts }: Props) => {
    return (
        <>
            {posts.map(post => <p key={post.id}>{post.title}</p>)}
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.post.findMany();
    const posts: Post[] = await JSON.parse(JSON.stringify(res));

    return {
        props: { posts }
    }
}

interface Props {
    posts: Post[]
}

export default Posts;