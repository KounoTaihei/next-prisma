import { Item, Note, User } from ".prisma/client";

export interface NoteWithUser extends Note {
    user: User
}

export interface NoteWithItems extends Note {
    items: Item[]
}