import { Item, Note, User } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { getFormattedDate } from "../../../functions/get_formatted_date";
import prisma from "../../../lib/prisma";
import Image from "next/image";
import imageurl from "../../../public/20141126_unsplash.webp";
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Tab, Tabs } from "@material-ui/core";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { useState } from "react";
import { useSession } from "next-auth/client";
import { faEllipsisV, faHeart, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animateScroll as Scroll } from "react-scroll";
import { BreadCrumbs } from "../../../components/breadcrumbs";

const FindItemsByNoteId = ({ note, items }: Props) => {
    const [ value, setValue ] = useState<number>(0);
    const [ session ] = useSession();

    const useStyles = makeStyles({
        tabs: {
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(255,255,255,0.9)",
            zIndex: 10
        },
        timeline: {
            "&:before": {
                display: "none"
            }
        },
        cardContent: {
            whiteSpace: "pre-wrap"
        },
        imageListWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
        },
        imageList: {
            flexWrap: 'nowrap',
        },
        topIcon: {
            fontSize: "1em"
        },
        icon: {
            fontSize: "1.2em"
        },
        titleText: {
            width: "fit-content"
        }
    });

    const classes = useStyles();

    /** タブの切り替え */
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: any) {
        return {
          id: `scrollable-auto-tab-${index}`,
          'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }
    /** --- */

    /** タイムライン */
    const timelineContent = ( item: Item ) => {
        return (
            <>
                <Card>
                    <CardHeader
                        subheader={
                            <>
                                <span className="text-black">{item.title}</span><br></br>
                                {getFormattedDate(item.createdAt)}
                            </>
                        }
                        action={
                            <IconButton>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </IconButton>
                        }
                    />
                    <div className={classes.imageListWrapper}>
                        <ImageList className={classes.imageList} cols={1.1}>
                            {paths.map((path, i) =>
                                <ImageListItem key={i}>
                                    <Image src={imageurl} />
                                </ImageListItem>
                            )}
                        </ImageList>
                    </div>
                    <CardContent className={classes.cardContent}>
                        {item.body}
                    </CardContent>
                    <div className="flex justify-between">
                        <CardActions>
                            <IconButton className={classes.icon}>
                                <FontAwesomeIcon icon={faHeart} />
                            </IconButton>
                        </CardActions>
                        <CardActions>
                            <IconButton className={classes.icon}>
                                <FontAwesomeIcon icon={faPen} />
                            </IconButton>
                            <IconButton className={classes.icon}>
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </CardActions>
                    </div>
                </Card>
            </>
        )
    }

    const scrollToItem = (id: string) => {
        if(!document.getElementById(id) || !document.getElementById('tabs')) {
            return ;
        }
        const tabsHeight: number = document.getElementById('tabs')?.clientHeight!;
        const height: number = document.getElementById(id)?.getBoundingClientRect().top!;
        Scroll.scrollTo(height + window.pageYOffset - tabsHeight);
    }
    /** --- */

    /** 画像リスト */
    const paths: string[] = [
        "20141126_unsplash.webp",
        "20141126_unsplash.webp",
        "20141126_unsplash.webp",
        "20141126_unsplash.webp",
    ];
    /** --- */

    return (
        <>
            <BreadCrumbs
                links={[
                    {
                        path: "/notes",
                        name: "ノート一覧"
                    }
                ]}
                current={note.title}
            />
            <div className="text-center p-4">
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Image src={note.user.image!} layout="fill" loading="lazy" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.titleText}
                            primary={note.title}
                            secondary={
                                <>
                                    {note.user.name}が{getFormattedDate(note.createdAt)}に作成
                                </>
                            }
                        />
                    </ListItem>
                </List>
                {session?.user.id === note.userId && (
                    <div>
                        <Link href={`/items/create/${note.id}`}>
                            <IconButton className={classes.topIcon}>
                                <FontAwesomeIcon icon={faPlus} />
                            </IconButton>
                        </Link>
                        <IconButton className={classes.topIcon}>
                            <FontAwesomeIcon icon={faPen} />
                        </IconButton>
                        <IconButton className={classes.topIcon}>
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </div>
                )}
            </div>
            {items.length > 0 ? 
                <>
                    <Tabs
                        id="tabs"
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        className={classes.tabs}
                    >
                        {items.map((item, i) =>
                            <Tab
                                key={i}
                                label={item.id}
                                {...a11yProps(i)}
                                onClick={() => scrollToItem(item.id)}
                            />
                        )}
                    </Tabs>
                    <Timeline>
                        {items.map((item, i) =>
                            <div id={item.id} key={i}>
                                <TimelineItem
                                    className={classes.timeline}
                                >
                                    <TimelineSeparator>
                                        <TimelineDot />
                                        {items.length !== i + 1 ? <TimelineConnector /> : null}
                                    </TimelineSeparator>
                                    <TimelineContent>{timelineContent(item)}</TimelineContent>
                                </TimelineItem>
                            </div>
                        )}
                    </Timeline>
                </>
                :
                <p>アイテムはありません</p>
            }
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes: Note[] = await prisma.note.findMany();
    const paths = notes.map(note => `/items/note/${note.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const noteId = params?.noteId?.toString();

    const note: Note | null = await prisma.note.findUnique({
        where: {
            id: noteId
        },
        include: {
            user: true
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    const items: Item[] = await prisma.item.findMany({
        where: {
            noteId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));
    
    return {
        props: {
            note,
            items
        }
    }
}

interface NoteWithUser extends Note {
    user: User
}

interface Props {
    note: NoteWithUser
    items: Item[]
}

export default FindItemsByNoteId;