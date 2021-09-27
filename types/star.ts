import { Star } from ".prisma/client";
import { NoteWithUserAndItems } from "./note";

export interface StarWithNoteWithUserAndItems extends Star {
    note: NoteWithUserAndItems
}