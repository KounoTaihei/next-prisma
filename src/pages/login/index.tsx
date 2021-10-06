import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Link from 'next/link';
import { useEffect } from "react";
import { Loader } from "../../components/loader";

const Login = () => {
    const [ session, loading ] = useSession();
    const router = useRouter();

    useEffect(() => {
        if(!loading) {
            if(session) {
              router.replace(`/profile/${session.user.id}`);
            }
        }
    },[loading])

    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                margin: "0 auto",
            },
            icon: {
                fontSize: "1.5em",
                color: "#4285F4"
            },
            typography: {
                fontSize: "0.8em"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            {loading && (
                <div className="text-center py-8">
                    <Loader />
                    <Typography className={classes.typography}>ログイン情報を確認中...</Typography>
                </div>
            )}
            {(!session && !loading) && (
                <div className="text-center py-12">
                    <Button
                        onClick={() => signIn('google')}
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<FontAwesomeIcon icon={faGoogle} className={classes.icon} />}
                        >
                        Googleでサインイン
                    </Button>
                    <div className="py-4">
                        <Link href="/notes">
                            <a className="text-blue-500 hover:underline">サインインせずに見る</a>
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login;