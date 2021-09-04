import { Item, Note, User } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { formatDate } from "../../../functions/date.format";
import prisma from "../../../lib/prisma";
import Image from "next/image";
import imageurl from "../../../public/20141126_unsplash.webp";
import { Avatar, Box, Tab, Tabs, Typography } from "@material-ui/core";
import { useState } from "react";

const apiUrl = process.env.API_URL;

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className="p-4">
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: any) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const FindItemsByNoteId = ({ note, items }: Props) => {
    const [value, setValue] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="text-center p-8">
                <div className="flex justify-center items-center">
                    <Avatar alt="" src={note.user.image} className="mr-2" />
                    <p>{note.user.name}</p>
                </div>
                <p>{note.title}({formatDate( note.createdAt )})</p>
                <Link href={`/items/create/${note.id}`}><a className="float-right">このノートにアイテムを追加する</a></Link>
            </div>
            {items.length > 0 ? 
                <div className="flex">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className="border-r"
                    >
                    {items.map((item, i) => 
                        <Tab
                            key={item.id}
                            label={formatDate(item.createdAt)}
                            {...a11yProps(i)}
                        />
                    )}
                    </Tabs>
                    {items.map((item, i) =>
                        <TabPanel key={item.id} value={value} index={i}>
                            <div className="flex justify-start">
                                <span className="w-1/4 p-2">
                                    <Image src={imageurl} />
                                </span>
                                <span className="w-1/4 p-2">
                                    <Image src={imageurl} />
                                </span>
                            </div>
                            <div className="p-2">
                                {item.body}
                            </div>
                        </TabPanel>
                    )}
                </div>
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