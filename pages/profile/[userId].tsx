import { User } from ".prisma/client";
import { Button } from "@material-ui/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { UserWithNotes } from "../../types/user";
import prisma from "../../lib/prisma";

const Profile = ({ user }: Props) => {
    const [ session ] = useSession();
    const router = useRouter();

    return (
        <>
            {session?.user.name}
            <Button onClick={() => signOut()}>ログアウト</Button>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const users: User[] = await prisma.user.findMany();
    const paths = users.map(user => `/profile/${user.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.userId?.toString();
    const user: User | null = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            notes: true
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    return {
        props: { user }
    }
}

export default Profile;

interface Props {
    user: UserWithNotes
}