import { Note } from "@prisma/client";
import { ItemWithHearts } from '../../../types/item';
import { GetStaticPaths, GetStaticProps } from "next";
import { getFormattedDate } from "../../../functions/get_formatted_date";
import prisma from "../../../lib/prisma";
import Image from "next/image";
import { Avatar, CardActions, CardContent, CardHeader, IconButton, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Tab, Tabs } from "@material-ui/core";
import { Timeline, TimelineContent, TimelineItem } from '@material-ui/lab';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { faHeart, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animateScroll as Scroll } from "react-scroll";
import { BreadCrumbs } from "../../components/breadcrumbs";
import { ItemCreateModal } from "../../components/items/item_create.modal";
import { NoteUpdateModal } from "../../components/notes/note_update.modal";
import { NoteDeleteModal } from "../../components/notes/note_delete.modal";
import { NoteWithUser } from "../../../types/note";
import { revalidateTime } from "../../../lib/revalidate_time";
import { getHearted } from "../../../functions/get_hearted";
import { Loader } from "../../components/loader";
import { getDownloadURL } from "firebase/storage";

const FindItemsByNoteId = (props: Props) => {
    const [ note, setNote ] = useState<NoteWithUser>(props.note);
    const [ items, setItems ] = useState<ItemWithHearts[]>(props.items);
    const [ value, setValue ] = useState<number>(0);
    const [ session ] = useSession();
    const [ processing, setProcessing ] = useState<boolean>(false);

    const [ itemCreateModalOpen, setItemCreateModalOpen ] = useState<boolean>(false);
    const [ noteUpdateModalOpen, setNoteUpdateModalOpen ] = useState<boolean>(false);
    const [ noteDeleteModalOpen, setNoteDeleteModalOpen ] = useState<boolean>(false);

    /** ノートを再取得 */
    const getNote = async () => {
        try {
            const res = await fetch(`/api/notes/${note.id}`);
            const data: NoteWithUser = await res.json();
            setNote(data);
        } catch (err) {
            console.log(err);
        }
    }

    /** アイテム一覧を再取得 */
    const getItems = async () => {
        try {
            const res = await fetch(`/api/items/${note.id}`)
            const data: ItemWithHearts[] = await res.json();
            setItems(data);
        } catch (err) {
            console.log(err);
        }
    }

    /** Heartを作成 */
    const createHeart = async (itemId: string) => {
        if(!session?.user) {
            return;
        }

        setProcessing(true);
        try {
            await fetch('/api/hearts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId,
                    userId: session.user.id
                })
            })
            .then(() => { getItems() });
        } catch (err) {
            console.log(err);
        }
        setProcessing(false);
    }

    /** Heartを削除 */
    const deleteHeart = async (itemId: string) => {
        if(!session?.user) {
            return;
        }

        setProcessing(true);
        try {
            await fetch('/api/hearts/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId,
                    userId: session.user.id
                })
            })
            .then(() => { getItems() });
        } catch (err) {
            console.log(err);
        }
        setProcessing(false);
    }

    /** ノートの作成者がログインユーザーならデータを再取得 */
    useEffect(() => {
        if((session && session.user.id === note.user.id) && !itemCreateModalOpen) {
            getItems();
        }
    },[itemCreateModalOpen])

    useEffect(() => {
        if((session && session.user.id === note.user.id) && !noteDeleteModalOpen) {
            getItems();
        }
    },[noteDeleteModalOpen])

    useEffect(() => {
        if((session && session.user.id === note.user.id) && !noteUpdateModalOpen) {
            getNote();
        }
    },[noteUpdateModalOpen])
    /** --- */

    const useStyles = makeStyles({
        tabs: {
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(255,255,255,0.9)",
            zIndex: 10,
            boxShadow: "2px 2px 2px gray"
        },
        timeline: {
            "&:before": {
                display: "none"
            }
        },
        cardContent: {
            whiteSpace: "pre-wrap",
            textAlign: "center"
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
            fontSize: "1.2em",
            margin: "0 5px"
        },
        icon: {
            fontSize: "1.2em",
            padding: "0.5rem"
        },
        titleText: {
            width: "fit-content",
        },
        flexActions: {
            display: "flex",
            alignItems: "center"
        },
        activeHeart: {
            fontSize: "1.2em",
            padding: "0.5rem",
            color: "pink"
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
    const timelineContent = ( item: ItemWithHearts ) => {
        return (
            <>
                <CardHeader
                    subheader={
                        <>
                            <div className="text-center ::after">
                                <span className="text-black">{item.title} ({getFormattedDate(item.createdAt)})</span>
                            </div>
                        </>
                    }
                />
                <div className={classes.imageListWrapper}>
                    <img src={item.image!} />
                </div>
                <CardContent className={classes.cardContent}>
                    {item.body}
                </CardContent>
                <div className="flex justify-between">
                    <CardActions className={item.hearts ? classes.flexActions : ""}>
                        {(session && getHearted(item, session.user.id)) && (
                            <IconButton className={classes.activeHeart} onClick={() => deleteHeart(item.id)}>
                                <FontAwesomeIcon icon={faHeart} />
                            </IconButton>
                        )}
                        {(session && !getHearted(item, session.user.id) && (
                            <IconButton className={classes.icon} onClick={() => createHeart(item.id)}>
                                <FontAwesomeIcon icon={faHeart} />
                            </IconButton>
                        ))}
                        {!session && (
                            <IconButton className={classes.icon}>
                                <FontAwesomeIcon icon={faHeart} />
                            </IconButton>
                        )}
                        {item.hearts && (
                            <span>{item.hearts.length}</span>
                        )}
                    </CardActions>
                    <CardActions>
                        {session?.user.id === note.userId && (
                            <>
                                <IconButton className={classes.icon}>
                                    <FontAwesomeIcon icon={faPen} />
                                </IconButton>
                                <IconButton className={classes.icon}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </IconButton>
                            </>
                        )}
                    </CardActions>
                </div>
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
                                <Image src={note.user.image!} layout="fill" loading="lazy" alt="ログインユーザーの画像" />
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
                {/* ノート作成者とセッションユーザーが同じなら表示 */}
                {session?.user.id === note.userId && (
                    <div>
                        <IconButton className={classes.topIcon} onClick={() => setItemCreateModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                        <ItemCreateModal
                            note={note}
                            modalOpen={itemCreateModalOpen}
                            setModalOpen={setItemCreateModalOpen}
                        />
                        <IconButton className={classes.topIcon} onClick={() => setNoteUpdateModalOpen(true)}>
                            <FontAwesomeIcon icon={faPen} />
                        </IconButton>
                        <NoteUpdateModal
                            note={note}
                            modalOpen={noteUpdateModalOpen}
                            setModalOpen={setNoteUpdateModalOpen}
                        />
                        <IconButton className={classes.topIcon} onClick={() => setNoteDeleteModalOpen(true)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                        <NoteDeleteModal
                            note={note}
                            itemsLength={items.length}
                            modalOpen={noteDeleteModalOpen}
                            setModalOpen={setNoteDeleteModalOpen}
                        />
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
                                label={item.title}
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
                                    <TimelineContent>{timelineContent(item)}</TimelineContent>
                                </TimelineItem>
                            </div>
                        )}
                    </Timeline>
                </>
                :
                <p className="text-center">アイテムはありません</p>
            }
            {/* 読み込み中の表示 */}
            {processing && (
                <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-black z-50 opacity-60">
                    <Loader />
                </div>
            )}
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes: Note[] = await prisma.note.findMany();
    const paths = notes.map(note => `/items/${note.id}`);

    return { paths, fallback: "blocking" }
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

    const items: ItemWithHearts[] = await prisma.item.findMany({
        where: {
            noteId
        },
        include: {
            hearts: true
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
        },
        revalidate: revalidateTime
    }
}

interface Props {
    note: NoteWithUser
    items: ItemWithHearts[]
}

export default FindItemsByNoteId;