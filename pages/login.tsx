import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useSession, signIn } from "next-auth/client";
import Link from 'next/link';

const Login = () => {
    const [ session, loading ] = useSession();

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

    if(loading) {
        return (
            <div className="text-center py-8">
                <CircularProgress
                color="primary"
                />
                <Typography className={classes.typography}>ログイン情報を確認中...</Typography>
            </div>
        )
    }

    return (
        <>
            {!session ? (
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
            ) : (
                <div className="text-center py-12">
                    <div className="py-2">
                        {session.user.name}としてログインしています。
                    </div>
                    <div className="py-2">
                        <Link href="/notes">
                            <a className="text-blue-500 hover:underline">ノート一覧</a>
                        </Link>
                    </div>
                    <div className="py-2">
                        <Link href={`/profile/${session.user.id}`}>
                            <a className="text-blue-500 hover:underline">プロフィール</a>
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login;