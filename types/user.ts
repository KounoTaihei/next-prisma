import { Note, User } from ".prisma/client";
import { NoteWithItems } from "./note";

export interface UserWithNotes extends User {
    notes: Note[]
}

export interface UserWithNotesWithItems extends User {
    notes: NoteWithItems[]
}