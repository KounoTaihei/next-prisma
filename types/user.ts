import { Note, User } from ".prisma/client";

export interface UserWithNotes extends User {
    notes: Note[]
}