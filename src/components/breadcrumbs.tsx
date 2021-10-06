import { Breadcrumbs, Link as BCLink, Typography } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/styles";
import Link from 'next/link';

export const BreadCrumbs = ({ links, current }: Props) => {
    const useStyles = makeStyles(() => 
        createStyles({
            breadcrumbs: {
                backgroundColor: "#EFF6FF",
                padding: "0.5em",
                display: "flex",
                alignItems: "center"
            },
            link: {
                fontSize: "0.8em",
            },
            typography: {
                fontSize: "0.8em"
            }
        })
    )
    const classes = useStyles();

    return (
        <Breadcrumbs className={classes.breadcrumbs}>
            {links && links.map((link, i) =>
                <BCLink key={i}>
                    <Link href={link.path}>
                        <a className={classes.link}>{link.name}</a>
                    </Link>
                </BCLink>
            )}
            <Typography color="textSecondary" className={classes.typography}>{current}</Typography>
        </Breadcrumbs>
    )
}

interface Link {
    path: string
    name: string
}

interface Props {
    links?: Link[]
    current: string
}