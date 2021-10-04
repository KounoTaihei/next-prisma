import { CircularProgress } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/styles"

export const Loader = () => {
    const useStyles = makeStyles(() =>
        createStyles({
            loader: {
                color: "#6EE7B7"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            <CircularProgress className={classes.loader} />
        </>
    )
}