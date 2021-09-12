import { Item, Note, User } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { formatDate } from "../../../functions/date.format";
import prisma from "../../../lib/prisma";
import Image from "next/image";
import imageurl from "../../../public/20141126_unsplash.webp";
import { Avatar, makeStyles, Tab, Tabs } from "@material-ui/core";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { useState } from "react";
import { useSession } from "next-auth/client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animateScroll as Scroll } from "react-scroll";

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
                <div>{formatDate(item.createdAt)}</div>
                <div className="flex flex-wrap">
                    {paths.map((path, i) =>
                        <span key={i} className="w-1/2 p-1">
                            <Image src={imageurl} />
                        </span>
                    )}
                </div>
                <p>{item.title}</p>
                <p>{item.body}</p>
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
            <div className="text-center p-8">
                <div className="flex justify-center items-center">
                    <Avatar>
                        {note.user.image && <Image src={note.user.image} layout="fill" loading="lazy" />}
                    </Avatar>
                    <p className="p-2">{note.user.name}</p>
                </div>
                <p>{note.title}({formatDate( note.createdAt )})</p>
                {session?.user.id === note.userId &&
                    <Link href={`/items/create/${note.id}`}><a className="float-right"><FontAwesomeIcon icon={faPlus} /></a></Link>
                }
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