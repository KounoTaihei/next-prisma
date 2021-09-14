import { Note, User } from ".prisma/client";

export interface NoteWithUser extends Note {
    user: User
}