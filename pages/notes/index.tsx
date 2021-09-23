import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Avatar, Button, CircularProgress, FormControl, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, NativeSelect, TextField } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Image from 'next/image';
import { getFormattedDate } from "../../functions/get_formatted_date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { getLatestDate } from "../../functions/get_latest_date";
import { useState } from "react";
import { NoteCreateModal } from '../../components/notes/note_create.modal';
import { BreadCrumbs } from "../../components/breadcrumbs";
import { revalidateTime } from "../../lib/revalidate_time";
import { NoteWithUserAndItems } from "../../types/note";
import { getSortedNotes } from "../../functions/get_sorted_notes";
import styles from '../../styles/Note.module.scss';
import { Formik } from "formik";

const Notes = (props: Props) => {
    const [ notes, setNotes ] = useState<NoteWithUserAndItems[]>(getSortedNotes(props.notes, "0", "0"));
    const [ modalOpen, setModalOpen ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                width: "100%"
            },
            openIconActive: {
                transform: "rotate(180deg)",
                transitionDuration: "0.3s"
            },
            openIcon: {
                transform: "ratate(0)",
                transitionDuration: "0.3s"
            },
            icon: {
                fontSize: "1.4em",
                padding: "1rem"
            },
            formControl: {
                margin: "0.3rem",
            },
            searchInput: {
                width: "70%"
            }
        })
    );
    const classes = useStyles();

    const initialValues: FormValues = {
        searchText: "",
        orderBy: "0",
        ascOrDesc: "0"
    }

    const submit = async (values: FormValues) => {
        setSubmitting(true);
        console.log(values);

        let data: NoteWithUserAndItems[];
        if(values.searchText) {
            data = await fetch(`/api/notes/${values.searchText}`)
            .then(res => res.json());
        } else {
            data = await fetch('/api/notes')
            .then(res => res.json());
        }

        const newNotes = getSortedNotes(data, values.orderBy, values.ascOrDesc);
        setNotes(newNotes);

        setSubmitting(false);
    }

    return (
        <>
            <BreadCrumbs
                current="ノート一覧"
            />
            {/* 検索メニュー等 */}
            <div className={menuOpen ? `${styles.menu_wrapper} ${styles.active}` : styles.menu_wrapper}>
                <div className="flex justify-between">
                    <IconButton
                        className={classes.icon}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FontAwesomeIcon icon={faChevronDown} className={menuOpen ? classes.openIconActive : classes.openIcon} />
                    </IconButton>
                    <IconButton
                        onClick={() => setModalOpen(true)}
                        className={classes.icon}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                </div>
                {/* 検索、ソートメニュー */}
                <div className="bg-white relative">
                <div className={menuOpen ? `${styles.overlay} ${styles.active}` : styles.overlay} onClick={() => setMenuOpen(false)}></div>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submit}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <form onSubmit={handleSubmit} className={menuOpen ? `${styles.menu} ${styles.active}` : styles.menu}>
                                <div className="w-full">
                                    <div className="flex justify-evenly">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel variant="standard" htmlFor="orderbyInput">
                                                並び替え
                                            </InputLabel>
                                            <NativeSelect
                                                id="orderByInput"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.orderBy}
                                                name="orderBy"
                                            >
                                                <option value={0}>ノート内のアイテムの作成日</option>
                                                <option value={1}>ノートの作成日</option>
                                                <option value={2}>ノート内のアイテムの数</option>
                                            </NativeSelect>
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel variant="standard" htmlFor="ascOrDescInput">
                                                順
                                            </InputLabel>
                                            <NativeSelect
                                                id="ascOrDescInput"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.ascOrDesc}
                                                name="ascOrDesc"
                                            >
                                                <option value={0}>降順</option>
                                                <option value={1}>昇順</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </div>
                                    <FormControl fullWidth variant="standard" className={classes.formControl}>
                                        <TextField
                                            label="ノートを検索"
                                            name="searchText"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.searchText}
                                        />
                                    </FormControl>
                                </div>
                                <div className={submitting ? `${styles.submitbtn} ${styles.active}` : styles.submitbtn}>
                                    <IconButton className={classes.icon} type="submit" disabled={isSubmitting}>
                                        <FontAwesomeIcon icon={faSyncAlt} />
                                    </IconButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            {submitting && (
                <div className="text-center py-8">
                    <CircularProgress color="primary"/>
                </div>
            )}
            {!submitting && (
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

interface FormValues {
    searchText: string
    orderBy: string
    ascOrDesc: string
}

export default Notes;