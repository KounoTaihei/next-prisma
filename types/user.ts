import { Note, User } from ".prisma/client";
import { NoteWithItems } from "./note";
import { StarWithNoteWithUserAndItems } from "./star";

export interface UserWithNotes extends User {
    notes: Note[]
}

export interface UserWithNotesWithItems extends User {
    notes: NoteWithItems[]
}

export interface UserWithStarsWithNoteWithUserAndItems extends User {
    stars: StarWithNoteWithUserAndItems[]
}