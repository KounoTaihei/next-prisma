import { Button, CircularProgress } from "@material-ui/core";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

const Profile = () => {
    const [ session, loading ] = useSession();
    const router = useRouter();

    if(loading) {
        return <span className="text-center"><CircularProgress /></span>
    }

    return (
        <>
            {session?.user.name}
            <Button onClick={() => signOut()}>ログアウト</Button>
        </>
    )
}

export default Profile;