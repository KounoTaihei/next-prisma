import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Avatar, Button, CircularProgress, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, NativeSelect } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Image from 'next/image';
import { getFormattedDate } from "../../functions/get_formatted_date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { getLatestDate } from "../../functions/get_latest_date";
import { useEffect, useState } from "react";
import { NoteCreateModal } from '../../components/notes/note_create.modal';
import { BreadCrumbs } from "../../components/breadcrumbs";
import { revalidateTime } from "../../lib/revalidate_time";
import { NoteWithUserAndItems } from "../../types/note";
import { getSortedNotes } from "../../functions/get_sorted_notes";

const Notes = (props: Props) => {
    const [ orderBy, setOrderBy ] = useState<number>(0);
    const [ ascOrDesc, setAscOrDesc ] = useState<number>(0);
    const [ notes, setNotes ] = useState<NoteWithUserAndItems[]>(getSortedNotes(props.notes, orderBy, ascOrDesc));
    const [ modalOpen, setModalOpen ] = useState<boolean>(false);
    
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ searchText, setSearchText ] = useState<string>('');

    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                width: "100%"
            },
            icon: {
                fontSize: "1.2em",
                padding: "0.8rem"
            },
        })
    );
    const classes = useStyles();

    /** ノートを検索 */
    const search = async () => {
        setLoading(true);
        const data: NoteWithUserAndItems[] = await fetch(`/api/notes/search/${searchText}`).then(res => res.json());
        setNotes(getSortedNotes(data, orderBy, ascOrDesc));
        setLoading(false);
    }

    // ソート
    const sort = () => {
        setNotes(getSortedNotes(notes, orderBy, ascOrDesc));
    }

    useEffect(() => {
        sort();        
    },[orderBy, ascOrDesc])

    return (
        <>
            <BreadCrumbs
                current="ノート一覧"
            />
            {/* 検索メニュー等 */}
            <div className="relative">
                <div className="flex justify-between">
                    <IconButton
                        className={classes.icon}
                    >
                        <FontAwesomeIcon icon={faChevronDown} />
                    </IconButton>
                    <IconButton
                        onClick={() => setModalOpen(true)}
                        className={classes.icon}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                </div>
                <div className="w-full bg-green-50 text-center">
                    <FormControl variant="standard">
                        <InputLabel htmlFor="searchInput">ノートを検索</InputLabel>
                        <Input
                            id="searchInput"
                            onChange={(e) => setSearchText(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={search} className={classes.icon}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <div className="flex justify-evenly">
                        <FormControl>
                            <InputLabel variant="standard" htmlFor="orderbyInput">
                                並び替え
                            </InputLabel>
                            <NativeSelect
                                defaultValue={0}
                                inputProps={{
                                    id: "orderbyInput"
                                }}
                                onChange={(e) => setOrderBy(Number(e.target.value))}
                            >
                                <option value={0}>ノート内のアイテムの作成日</option>
                                <option value={1}>ノートの作成日</option>
                                <option value={2}>ノート内のアイテムの数</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl>
                            <InputLabel variant="standard" htmlFor="ascOrDescInput">
                                順
                            </InputLabel>
                            <NativeSelect
                                defaultValue={0}
                                inputProps={{
                                    id: "ascOrDescInput"
                                }}
                                onChange={(e) => setAscOrDesc(Number(e.target.value))}
                            >
                                <option value={0}>降順</option>
                                <option value={1}>昇順</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="text-center py-8">
                    <CircularProgress color="primary"/>
                </div>
            )}
            {!loading && (
                <List>
                    {notes.map(note =>
                        <Link href={`/items/${note.id}`} key={note.id} passHref>
                            <Button className={classes.button}>
                                <ListItem key={note.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Image src={note.user.image!} layout="fill" loading="lazy" alt="作成者の画像" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <>
                                                {note.title}（{note.items.length}）
                                            </>
                                        }
                                        secondary={
                                            <>
                                                {note.user.name}が{getFormattedDate(note.createdAt)}に作成<br></br>
                                                {note.items.length ?
                                                    <>
                                                        <FontAwesomeIcon icon={faPen} className="mr-1" />
                                                        {getFormattedDate(getLatestDate(note.items.map(item => item.createdAt)))}
                                                    </>
                                                : ""}
                                            </>
                                        }
                                        />
                                </ListItem>
                            </Button>
                        </Link>
                    )}
                </List>
            )}
            <NoteCreateModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.note.findMany({
        include: {
            user: true,
            items: true
        }
    });
    const notes: NoteWithUserAndItems[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            notes
        },
        revalidate: revalidateTime
    }
}

interface Props {
    notes: NoteWithUserAndItems[]
}

export default Notes;