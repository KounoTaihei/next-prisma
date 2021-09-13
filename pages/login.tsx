import { Button, CircularProgress } from "@material-ui/core";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

const Login = () => {
    const [ session, loading ] = useSession();
    const router = useRouter();

    if(loading) {
        return <CircularProgress />
    }

    return (
        <>
            <Button variant="outlined" onClick={() => signIn('google')}>Googleでサインイン</Button>
        </>
    )
}

export default Login;